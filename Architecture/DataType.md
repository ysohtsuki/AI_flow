# AI学習ツール用詳細データタイプ分類表

| 大分類         | 小分類（型名） | 説明 |
|---------------|-------------|------|
| 数値型         | Int         | 整数 |
|               | Float       | 浮動小数点数 |
| カテゴリ型      | String      | 文字列 |
|               | Bool        | ブール値（True/False） |
| 時系列型       | DateTime    | 日付と時刻 |
| 構造化データ型  | List        | 順序付きのデータ集合 |
|               | Dict        | キーと値のペア（辞書/オブジェクト） |
|               | DataFrame   | 表形式の2次元データ構造 |
| テンソル型      | Vector      | 1次元のデータ配列 |
|               | Matrix      | 2次元のデータ配列 |
|               | Tensor      | 多次元配列（3次元以上） |
| メディア型      | Image       | 画像データ |
|               | Audio       | 音声データ |
|               | Text        | 長文や文書データ |
|               | Dataset     | 訓練データやテストデータなどの大規模なデータセット |
| モデル型       | Model       | 学習済みのAIモデル |
|               | ModelParams | モデルのパラメータ（重みや設定） |
| その他         | File        | 様々な形式のファイル |
|               | JSON        | JavaScript Object Notation |
|               | Custom      | ユーザー定義の特殊タイプ |

```javascript
dataTypes = {
  Int: { icon: 'mdi-numeric', color: '#4CAF50' },
  Float: { icon: 'mdi-decimal', color: '#8BC34A' },
  String: { icon: 'mdi-alphabetical', color: '#2196F3' },
  Bool: { icon: 'mdi-toggle-switch', color: '#FF9800' },
  DateTime: { icon: 'mdi-calendar-clock', color: '#9C27B0' },
  List: { icon: 'mdi-format-list-bulleted', color: '#FF5722' },
  Dict: { icon: 'mdi-code-braces', color: '#795548' },
  DataFrame: { icon: 'mdi-table', color: '#607D8B' },
  Vector: { icon: 'mdi-vector-line', color: '#F44336' },
  Matrix: { icon: 'mdi-grid', color: '#E91E63' },
  Tensor: { icon: 'mdi-cube-outline', color: '#9E9E9E' },
  Image: { icon: 'mdi-image', color: '#3F51B5' },
  Audio: { icon: 'mdi-volume-high', color: '#00BCD4' },
  Text: { icon: 'mdi-text', color: '#009688' },
  Model: { icon: 'mdi-brain', color: '#673AB7' },
  ModelParams: { icon: 'mdi-tune', color: '#CDDC39' },
  File: { icon: 'mdi-file', color: '#FFC107' },
  JSON: { icon: 'mdi-code-json', color: '#FF4081' },
  Custom: { icon: 'mdi-cog', color: '#607D8B' }
};
```