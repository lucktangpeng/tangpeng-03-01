// 实现这个项目的构建任务
const { src, dest, series, parallel, watch } = require("gulp");
const del = require("del");
const Browser = require("browser-sync");
const loadplugins = require("gulp-load-plugins");
const plugins = loadplugins();

const bs = Browser.create();

const style = () => {
  return src("src/assets/styles/*.scss", { base: "src" })
    .pipe(plugins.sass())
    .pipe(plugins.cleanCss())
    .pipe(dest("dist"));
};

const script = () => {
  return src("src/assets/scripts/*.js", { base: "src" })
    .pipe(plugins.babel({ presets: [require("@babel/preset-env")] }))
    .pipe(dest("dist"));
};

const page = () => {
  return src("src/*.html", { base: "src" })
    .pipe(plugins.swig())
    .pipe(dest("dist"));
};

const image = () => {
  return src("src/assets/images/**", { base: "src" })
    .pipe(plugins.imagemin())
    .pipe(dest("dist"));
};

const font = () => {
  return src("src/assets/fonts/**", { base: "src" })
    .pipe(plugins.imagemin())
    .pipe(dest("dist"));
};

const extra = () => {
  return src("public/**", { base: "public" }).pipe(dest("dist"));
};

const serve = () => {
  watch("src/assets/styles/*.scss", style);
  watch("src/assets/scripts/*.js", script);
  watch("src/*.html", page);
  watch(
    ["src/assets/images/**", "src/assets/fonts/**", "public/**"],
    bs.reload
  );
  bs.init({
    port: 5009,
    files: "dist/**",
    server: {
      baseDir: ["dist", "src"],
      routes: {
        "/node_modules": "node_modules",
      },
    },
  });
};

const useref = () => {
  return src("dist/*.html", { base: "dist" })
    .pipe(plugins.useref({ searchPath: ["dist", "."] }))
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(
      plugins.if(
        /\.html$/,
        plugins.htmlmin({
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
        })
      )
    )
    .pipe(dest("dist"));
};

const clean = () => {
  return del(["dist"]);
};

const compile = parallel(style, script, page);

const build = series(
  clean,
  parallel(series(compile, useref), image, font, extra)
);

const develop = series(compile, serve);
module.exports = {
  compile,
  build,
  develop,
};
