const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Импорт плагина для работы с HTML
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // Импорт плагина для работы с CSS

module.exports = {
  entry: {
    index: './src/js/index.js', // Точка входа для главной страницы
    about: './src/js/about.js', // Точка входа для страницы "О нас"
    todo: './src/js/todo.js', // Точка входа для страницы задач
    common: './src/js/common.js', // Точка входа для общего JavaScript
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'), // Папка, которую нужно сервировать
    compress: true, // Сжатие файлов
    port: 9000, // Порт, на котором будет работать сервер
    open: true, // Автоматически открывает браузер
    hot: false, // Включает Hot Module Replacement (HMR)
  },
  module: {
    rules: [
      {
        test: /\.css$/, // Обработка файлов CSS
        use: [
          MiniCssExtractPlugin.loader, // Извлечение CSS в отдельный файл
          'css-loader', // Загрузка CSS
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/pages/index.html', // Путь к шаблону HTML
      filename: 'index.html', // Имя выходного HTML файла
      chunks: ['index', 'common'], // Добавление общего файла
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/todo.html', // Путь к шаблону HTML
      filename: 'todo.html', // Имя выходного HTML файла
      chunks: ['todo', 'common'], // Добавление общего файла
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/about.html', // Путь к шаблону HTML
      filename: 'about.html', // Имя выходного HTML файла
      chunks: ['about', 'common'], // Добавление общего файла
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css', // Имя выходного CSS файла
    }),
  ],
  mode: 'development', // Режим разработки
};
