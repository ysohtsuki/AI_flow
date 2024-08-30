let editor; // Drawflowのインスタンス
let isDarkMode = false; // ダークモードのフラグ
let transform = ''; // キャンバスのトランスフォーム

const dataTypes = { // データ型のアイコンと色
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

const nodeTypes = [ // ノードの種類
  { 
      type: 'ReadCSV', 
      label: 'CSV入力', 
      icon: 'mdi-file-delimited', 
      category: 'data', 
      inputs: [], 
      outputs: [{ name: 'data', type: 'DataFrame' }] 
  },
  { 
    type: 'Load_dataset', 
    label: 'データ読み込み', 
    icon: 'mdi-camera-burst', 
    category: 'data', 
    inputs: [
        { name: 'train', type: 'List' },
        { name: 'test', type: 'List' }
    ], 
    outputs: [
        { name: 'train', type: 'List' },
        { name: 'test', type: 'List' }
    ] 
  },
  { 
      type: 'ReadDatabase', 
      label: 'DB入力', 
      icon: 'mdi-database', 
      category: 'data', 
      inputs: [], 
      outputs: [{ name: 'data', type: 'DataFrame' }] 
  },
  { 
      type: 'ReadAPI', 
      label: 'API入力', 
      icon: 'mdi-api', 
      category: 'data', 
      inputs: [], 
      outputs: [{ name: 'data', type: 'JSON' }] 
  },
  { 
      type: 'Interpolation', 
      label: '補間', 
      icon: 'mdi-chart-bell-curve-cumulative', 
      category: 'preprocessing', 
      inputs: [{ name: 'input', type: 'DataFrame' }], 
      outputs: [{ name: 'output', type: 'DataFrame' }] 
  },
  { 
    type: 'Pipeline', 
    label: '前処理のパイプライン', 
    icon: 'mdi-pipe', 
    category: 'preprocessing', 
    inputs: [], 
    outputs: [{ name: 'output', type: 'List' }] 
  },
  { 
      type: 'Normalization', 
      label: '正規化', 
      icon: 'mdi-chart-bell-curve', 
      category: 'preprocessing', 
      inputs: [{ name: 'input', type: 'DataFrame' }], 
      outputs: [{ name: 'output', type: 'DataFrame' }] 
  },
  { 
      type: 'Feature_Extraction', 
      label: '特徴選択', 
      icon: 'mdi-feature-search', 
      category: 'preprocessing', 
      inputs: [{ name: 'input', type: 'DataFrame' }], 
      outputs: [{ name: 'output', type: 'DataFrame' }] 
  },
  { 
      type: 'Split_data', 
      label: 'データの分割', 
      icon: 'mdi-call-split', 
      category: 'preprocessing', 
      inputs: [{ name: 'input', type: 'DataFrame' }], 
      outputs: [
          { name: 'train', type: 'DataFrame' },
          { name: 'test', type: 'DataFrame' }
      ] 
  },
  { 
      type: 'pca', 
      label: 'PCA', 
      icon: 'mdi-chart-scatter-plot', 
      category: 'preprocessing', 
      inputs: [{ name: 'input', type: 'DataFrame' }], 
      outputs: [{ name: 'output', type: 'DataFrame' }] 
  },
  { 
      type: 'Linear_regression', 
      label: '線形回帰', 
      icon: 'mdi-chart-line', 
      category: 'model', 
      inputs: [{ name: 'train', type: 'DataFrame' }], 
      outputs: [{ name: 'model', type: 'Model' }] 
  },
  { 
    type: 'Initialize_model', 
    label: 'モデルの初期化', 
    icon: 'mdi-arrow-u-left-bottom', 
    category: 'model', 
    inputs: [{ name: 'train', type: 'List' }], 
    outputs: [
        { name: 'model', type: 'Model' },
        { name: 'criterion', type: 'Model' },
        { name: 'optimizer', type: 'Model' },
        { name: 'scheduler', type: 'Model' }
    ] 
  },
  { 
    type: 'Train_model', 
    label: 'モデルの学習', 
    icon: 'mdi-brain', 
    category: 'model', 
    inputs: [
        { name: 'train', type: 'List' },
        { name: 'model', type: 'Model' },
        { name: 'criterion', type: 'Model' },
        { name: 'optimizer', type: 'Model' },
        { name: 'scheduler', type: 'Model' }
    ], 
    outputs: [
        { name: 'model', type: 'Model' },
        { name: 'losses', type: 'Model' },
        { name: 'accuracies', type: 'Model' },
        { name: 'n_epochs', type: 'Model' },
        { name: 'device', type: 'Model' },
    ] 
  },
  { 
    type: 'Save_model', 
    label: '重みの保存', 
    icon: 'mdi-bookmark-check-outline', 
    category: 'model', 
    inputs: [
        { name: 'model', type: 'Model' },
        { name: 'optimizer', type: 'Model' },
        { name: 'train', type: 'List' },
        { name: 'n_epochs', type: 'Model' }
    ], 
    outputs: []  
  },
  { 
      type: 'logistic_regression', 
      label: 'ロジスティック回帰', 
      icon: 'mdi-chart-sigmoid', 
      category: 'model', 
      inputs: [{ name: 'train', type: 'DataFrame' }], 
      outputs: [{ name: 'model', type: 'Model' }] 
  },
  { 
      type: 'decision_tree', 
      label: '決定木', 
      icon: 'mdi-file-tree', 
      category: 'model', 
      inputs: [{ name: 'train', type: 'DataFrame' }], 
      outputs: [{ name: 'model', type: 'Model' }] 
  },
  { 
      type: 'random_forest', 
      label: 'ランダムフォレスト', 
      icon: 'mdi-pine-tree', 
      category: 'model', 
      inputs: [{ name: 'train', type: 'DataFrame' }], 
      outputs: [{ name: 'model', type: 'Model' }] 
  },
  { 
      type: 'Accuracy', 
      label: '正解率', 
      icon: 'mdi-checkbox-marked-circle', 
      category: 'evaluation', 
      inputs: [
          { name: 'predictions', type: 'List' },
          { name: 'actual', type: 'List' }
      ], 
      outputs: [{ name: 'accuracy', type: 'Float' }] 
  },
  { 
    type: 'Evaluate_and_plot', 
    label: '評価とプロット', 
    icon: 'mdi-checkbox-marked-circle', 
    category: 'evaluation', 
    inputs: [
        { name: 'model', type: 'Model' },
        { name: 'test', type: 'List' },
        { name: 'device', type: 'Model' }
    ], 
    outputs: [{ name: 'accuracy', type: 'Float' }] 
  },
  { 
      type: 'confusion_matrix', 
      label: '混同行列', 
      icon: 'mdi-grid', 
      category: 'evaluation', 
      inputs: [
          { name: 'predictions', type: 'List' },
          { name: 'actual', type: 'List' }
      ], 
      outputs: [{ name: 'matrix', type: 'Matrix' }] 
  },
  { 
      type: 'roc_curve', 
      label: 'ROC曲線', 
      icon: 'mdi-chart-arc', 
      category: 'evaluation', 
      inputs: [
          { name: 'predictions', type: 'List' },
          { name: 'actual', type: 'List' },
          { name: 'actual', type: 'List' },
          { name: 'actual', type: 'List' },
          { name: 'actual', type: 'List' },
      ], 
      outputs: [{ name: 'curve', type: 'Image' }] 
  },
  { 
      type: 'MSE', 
      label: 'MSE', 
      icon: 'mdi-align-vertical-top', 
      category: 'evaluation', 
      inputs: [
          { name: 'predictions', type: 'Model' },
          { name: 'actual', type: 'DataFrame' }
      ], 
      outputs: [{ name: 'mse', type: 'Float' }] 
  },
];

// const nodeTypes = [
//     { type: 'ReadCSV', label: 'CSV入力', icon: 'mdi-file-delimited', category: 'data', inputs: 0, outputs: 1 },
//     { type: 'ReadDatabase', label: 'DB入力', icon: 'mdi-database', category: 'data', inputs: 0, outputs: 1 },
//     { type: 'ReadAPI', label: 'API入力', icon: 'mdi-api', category: 'data', inputs: 0, outputs: 1 },
//     { type: 'Interpolation', label: '補間', icon: 'mdi-chart-bell-curve-cumulative', category: 'preprocessing', inputs: 1, outputs: 1 },
//     { type: 'Normalization', label: '正規化', icon: 'mdi-chart-bell-curve', category: 'preprocessing', inputs: 1, outputs: 1 },
//     { type: 'Feature_Extraction', label: '特徴選択', icon: 'mdi-feature-search', category: 'preprocessing', inputs: 1, outputs: 1 },
//     { type: 'Split_data', label: 'データの分割', icon: 'mdi-call-split', category: 'preprocessing', inputs: 1, outputs: 2 },
//     { type: 'pca', label: 'PCA', icon: 'mdi-chart-scatter-plot', category: 'preprocessing', inputs: 1, outputs: 1 },
//     { type: 'Linear_regression', label: '線形回帰', icon: 'mdi-chart-line', category: 'model', inputs: 1, outputs: 1 },
//     { type: 'logistic_regression', label: 'ロジスティック回帰', icon: 'mdi-chart-sigmoid', category: 'model', inputs: 1, outputs: 1 },
//     { type: 'decision_tree', label: '決定木', icon: 'mdi-file-tree', category: 'model', inputs: 1, outputs: 1 },
//     { type: 'random_forest', label: 'ランダムフォレスト', icon: 'mdi-pine-tree', category: 'model', inputs: 1, outputs: 1 },
//     { type: 'Accuracy', label: '正解率', icon: 'mdi-checkbox-marked-circle', category: 'evaluation', inputs: 2, outputs: 0 },
//     { type: 'confusion_matrix', label: '混同行列', icon: 'mdi-grid', category: 'evaluation', inputs: 1, outputs: 0 },
//     { type: 'roc_curve', label: 'ROC曲線', icon: 'mdi-chart-arc', category: 'evaluation', inputs: 1, outputs: 0 },
//     { type: 'MSE', label: 'MSE', icon: 'mdi-align-vertical-top',category: 'evaluation', inputs: 2, outputs: 0 },

// ];

function exportWithCategory() { // カテゴリー情報を含めてエクスポート
    const exportedData = editor.export(); // Drawflowのデータをエクスポート

    // ノードにカテゴリー情報を追加する
    Object.values(exportedData.drawflow.Home.data).forEach(node => { // ノードを走査
        const nodeType = nodeTypes.find(nt => nt.type === node.name); // ノードタイプを取得
        if (nodeType) {
            // 新しいプロパティとしてcategoryを追加する
            node.category = nodeType.category; // ノードにカテゴリー情報を追加
            node.inputs_type = nodeType.inputs;
            node.outputs_type = nodeType.outputs;
        }
    });

    return exportedData; // エクスポートしたデータを返す
}





document.addEventListener('DOMContentLoaded', () => {
  const id = document.getElementById("drawflow"); // Drawflowコンテナの取得
  editor = new Drawflow(id); // Drawflowのインスタンスを作成
  editor.reroute = true; // リルートを有効にする
  editor.draggable_inputs = true; // ドラッグ可能な入力を有効にする
  editor.start(); // Drawflowを開始
  // editor.import();

  // ノードボタンの作成
  nodeTypes.forEach(nodeType => { // ノードタイプを走査
      const sectionElement = document.querySelector(`#${nodeType.category}-section .node-buttons`); // セクション要素を取得
      if (sectionElement) { // セクション要素が存在する場合
          const button = document.createElement('div'); // ボタン要素を作成
          button.className = 'drag-drawflow'; // クラスを追加
          button.innerHTML = `<i class="mdi ${nodeType.icon}"></i><span>${nodeType.label}</span>`; // アイコンとラベルを追加
          button.setAttribute('draggable', true); // ドラッグ可能にする
          button.addEventListener('dragstart', drag); // ドラッグイベントリスナーを追加
          button.setAttribute('data-node', nodeType.type); // ノードタイプをデータ属性として追加
          sectionElement.appendChild(button); // ボタンをセクションに追加
      }
  });

  // イベントリスナーの追加
  document.getElementById('runBtn').addEventListener('click', runFlow); // 実行ボタン
  document.getElementById('exportBtn').addEventListener('click', exportFlow); // エクスポートボタン
  document.getElementById('importBtn').addEventListener('click', importFlow); // インスポートボタン
  document.getElementById('clearBtn').addEventListener('click', () => editor.clearModuleSelected()); // クリアボタン
  document.getElementById('zoomInBtn').addEventListener('click', () => editor.zoom_in()); // ズームインボタン
  document.getElementById('zoomOutBtn').addEventListener('click', () => editor.zoom_out()); // ズームアウトボタン
  document.getElementById('zoomResetBtn').addEventListener('click', () => { // ズームリセットボタン
      editor.zoom_reset(); // ズームをリセット
      editor.canvas_x = 0; // キャンバスのX位置を初期位置にリセット
      editor.canvas_y = 0; // キャンバスのY位置を初期位置にリセット
      editor.precanvas.style.transform = `translate(${editor.canvas_x}px, ${editor.canvas_y}px) scale(${editor.zoom})`; // キャンバスのスタイルを更新
  });
  document.getElementById('lockBtn').addEventListener('click', toggleLock); // ロックトグルボタン
  document.getElementById('darkModeToggle').addEventListener('change', toggleDarkMode); // ダークモードトグルボタン

  // AIアシスタントトグルボタンが存在する場合のみイベントリスナーを追加
  const toggleAiAssistantBtn = document.getElementById('toggleAiAssistant'); // AIアシスタントトグルボタン
  if (toggleAiAssistantBtn) { // AIアシスタントトグルボタンが存在する場合
      toggleAiAssistantBtn.addEventListener('click', toggleAiAssistant); // AIアシスタントトグルボタン
  }

  // Drawflowコンテナにドロップイベントリスナーを追加
  id.addEventListener('drop', drop); // ドロップイベントリスナー
  id.addEventListener('dragover', allowDrop); // ドラッグオーバーイベントリスナー

  document.addEventListener('mouseup', () => { // マウスアップイベントリスナー
    isDragging = false; // ドラッグ中フラグをオフにする
  });

  // ズーム処理の改善
  editor.on('zoom', function(zoom) {
    // 代わりに直接スタイルを更新
    editor.precanvas.style.transform = `translate(${editor.canvas_x}px, ${editor.canvas_y}px) scale(${editor.zoom})`;
  });

  // Drawflowのイベントリスナー
  editor.on('nodeCreated', function(id) { // ノードが作成されたとき
      console.log("Node created " + id);
  });

  editor.on('nodeRemoved', function(id) { // ノードが削除されたとき
      console.log("Node removed " + id);
  });

  editor.on('nodeSelected', function(id) { // ノードが選択されたとき
      console.log("Node selected " + id);
  });

  editor.on('moduleCreated', function(name) { // モジュールが作成されたとき
      console.log("Module Created " + name);
  });

  editor.on('moduleChanged', function(name) { // モジュールが変更されたとき
      console.log("Module Changed " + name);
  });

  editor.on('connectionCreated', function(connection) { // 接続が作成されたとき
      console.log('Connection created', connection);
  });

  editor.on('connectionRemoved', function(connection) { // 接続が削除されたとき
      console.log('Connection removed', connection);
  });

  editor.on('mouseMove', function(position) { // マウスが移動したとき
      //console.log('Position mouse x:' + position.x + ' y:'+ position.y);
  });

  editor.on('nodeMoved', function(nodeId) { // ノードが移動したとき
      const nodeInfo = editor.getNodeFromId(nodeId); // ノード情報を取得
      const canvas = editor.precanvas; // キャンバスを取得
      const zoom = editor.zoom; // ズームレベルを取得
      const canvasRect = canvas.getBoundingClientRect(); // キャンバスの矩形を取得
      
      // ノードの位置を計算 (ズームを考慮)
      const nodeX = (nodeInfo.pos_x / zoom) + canvasRect.left; // ノードのX位置
      const nodeY = (nodeInfo.pos_y / zoom) + canvasRect.top; // ノードのY位置
      
      // マウスの位置を取得
      const mouseX = editor.mouse_x; // マウスのX位置
      const mouseY = editor.mouse_y; // マウスのY位置
      
      // ノードとマウスの位置の差を計算
      const diffX = (mouseX - nodeX) * zoom; // X方向の差
      const diffY = (mouseY - nodeY) * zoom; // Y方向の差
      
      // 既存のデータを保持して新しい位置を設定
      const updatedData = { // 更新されたデータ
          ...nodeInfo.data, // 既存のデータを保持
          pos_x: nodeInfo.pos_x + diffX, // X位置を更新
          pos_y: nodeInfo.pos_y + diffY // Y位置を更新
      };
      editor.updateNodeDataFromId(nodeId, updatedData); // ノードのデータを更新
  });

  editor.on('zoom', function(zoom) {
      console.log('Zoom level ' + zoom);
  });

  editor.on('translate', function(position) {
      console.log('Translate x:' + position.x + ' y:'+ position.y);
  });

  editor.on('addReroute', function(id) {
      console.log("Reroute added " + id);
  });

  editor.on('removeReroute', function(id) {
      console.log("Reroute removed " + id);
  });
});

function toggleLock() { // ロックトグル
    const lockBtn = document.getElementById('lockBtn'); // ロックトグルボタン
    console.log(editor.editor_mode); // 現在のエディターモードをログに出力
    if (editor.editor_mode === 'fixed') { // エディターモードが固定の場合
        editor.editor_mode = 'edit'; // エディターモードを編集に変更
        lockBtn.innerHTML = '<i class="mdi mdi-lock-open"></i>'; // ロックアイコンを変更
    } else { // エディターモードが編集の場合
        editor.editor_mode = 'fixed'; // エディターモードを固定に変更
        lockBtn.innerHTML = '<i class="mdi mdi-lock"></i>'; // ロックアイコンを変更
    }
}

function toggleDarkMode() { // ダークモードトグル
    isDarkMode = !isDarkMode; // ダークモードフラグをトグル
    document.body.classList.toggle('dark-mode', isDarkMode); // ダークモードクラスをトグル
}

function toggleAiAssistant() { // AIアシスタントトグル
    const aiAssistant = document.getElementById('aiAssistant'); // AIアシスタント
    aiAssistant.classList.toggle('hidden'); // 非表示クラスをトグル
}

// ドラッグ＆ドロップの実装
function drag(ev) { // ドラッグ
  if (ev.type === "touchstart") { // タッチスタートの場合
      mobile_item_selec = ev.target.closest(".drag-drawflow").getAttribute('data-node'); // ノードを取得
  } else { // タッチスタート以外の場合
      ev.dataTransfer.setData("node", ev.target.closest(".drag-drawflow").getAttribute('data-node')); // ノードをデータとして設定
  }
}

function drop(ev) { // ドロップ
  ev.preventDefault(); // デフォルトの動作をキャンセル
  if (ev.type === "touchend") { // タッチエンドの場合
      var parentdrawflow = document.elementFromPoint( mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY).closest("#drawflow"); // Drawflowの親要素を取得
      if(parentdrawflow != null) { // 親要素が存在する場合
          addNodeToDrawFlow(mobile_item_selec, mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY); // ノードを追加(タッチ位置)
      }
      mobile_item_selec = ''; // ノードをクリア
  } else { // タッチエンド以外の場合
      var data = ev.dataTransfer.getData("node"); // ノードを取得
      addNodeToDrawFlow(data, ev.clientX, ev.clientY); // ノードを追加
  }
}

function allowDrop(ev) { // ドロップを許可
  ev.preventDefault(); // デフォルトの動作をキャンセル
}


function addNodeToDrawFlow(name, pos_x, pos_y) { // ノードを追加
    if(editor.editor_mode === 'fixed') { // エディターモードが固定の場合
        return false;
    }
    
    const zoom = editor.zoom; // ズームレベルを取得
    const precanvas = editor.precanvas; // プレキャンバスを取得
    const precanvasRect = precanvas.getBoundingClientRect(); // プレキャンバスの矩形を取得
    
    const canvasX = (pos_x - precanvasRect.left) / zoom; // キャンバスのX位置 (ズームを考慮)
    const canvasY = (pos_y - precanvasRect.top) / zoom; // キャンバスのY位置 (ズームを考慮)

    const nodeInfo = nodeTypes.find(nt => nt.type === name); // ノード情報を取得
    if (nodeInfo) { // ノード情報が存在する場合
        const inputsHtml = nodeInfo.inputs.map((input, index) => `
            <div class="input-area">
                <!-- <div class="input" data-type="${input.type}"></div> -->
                <span class="input-label">
                    <i class="mdi ${dataTypes[input.type].icon}" style="color: ${dataTypes[input.type].color};"></i>
                    ${input.name}
                </span>
            </div>
        `).join(''); // 入力エリアのHTMLを生成

        const outputsHtml = nodeInfo.outputs.map((output, index) => `
            <div class="output-area">
                <span class="output-label">
                    <i class="mdi ${dataTypes[output.type].icon}" style="color: ${dataTypes[output.type].color};"></i>
                    ${output.name}
                </span>
                <!-- <div class="output" data-type="${output.type}"></div> -->
            </div>
        `).join(''); // 出力エリアのHTMLを生成

        const nodeHtml = `
        <div class="node-content">
            <div class="title-box"><i class="mdi ${nodeInfo.icon}"></i> ${nodeInfo.label}</div>
            <div class="box">
                <div class="inputs-container">
                    ${inputsHtml}
                </div>
                <div class="outputs-container">
                    ${outputsHtml}
                </div>
            </div>
            <div class="node-settings">
                <button class="settings-btn" onclick="showPropertyEditor(event)">
                    <i class="mdi mdi-cog"></i>
                </button>
            </div>
        </div>
        `; // ノードのHTMLを生成
        editor.addNode(name, nodeInfo.inputs.length, nodeInfo.outputs.length, canvasX, canvasY, name, {}, nodeHtml); // ノードを追加
    }
}

function showPropertyEditor(e) { // プロパティエディターを表示
    const node = e.target.closest(".drawflow-node"); // ノードを取得
    const nodeId = node.id.slice(5); // "node-1" から "1" を取得
    const nodeData = editor.getNodeFromId(nodeId); // ノードデータを取得
    
    const propertyEditor = document.getElementById('propertyEditor'); // プロパティエディター
    const propertyForm = document.getElementById('propertyForm'); // プロパティフォーム
    propertyForm.innerHTML = ''; // プロパティフォームをクリア
    
    // ノードタイプに応じてプロパティを動的に生成
    const nodeInfo = nodeTypes.find(n => n.type === nodeData.name); // ノード情報を取得
    if (nodeInfo) { // ノード情報が存在する場合
        // const nameInput = createInput('name', 'テキスト', nodeData.data.name || '');
        // propertyForm.appendChild(nameInput);

        // ノードタイプ固有のプロパティを追加
        switch (nodeData.name) { // ノードタイプに応じて処理を分岐
            case 'ReadCSV': // CSV入力
                propertyForm.appendChild(createInput('file_path', 'テキスト', nodeData.data.file_path || ''));
                break;
            case 'Pipeline': // CSV入力
                propertyForm.appendChild(createInput('transforms', 'テキスト', nodeData.data.transforms || ''));
                break;
            case 'Feature_Extraction': // 特徴選択
                propertyForm.appendChild(createInput('colam', 'テキスト', nodeData.data.colam || ''));
                break;
            case 'ReadDatabase': // DB入力
                propertyForm.appendChild(createInput('connection_string', 'テキスト', nodeData.data.connection_string || ''));
                break;
            case 'Train_model':
                propertyForm.appendChild(createInput('batch_size', 'number', nodeData.data.batch_size || ''));
                propertyForm.appendChild(createInput('n_epochs', 'number', nodeData.data.n_epochs || ''));
                break;
            case 'Evaluate_and_plot':
                propertyForm.appendChild(createInput('num_labels', 'テキスト', nodeData.data.num_labels || ''));
                break;
            case 'Split_data': // データの分割
                propertyForm.appendChild(createInput('train_rate', 'number', nodeData.data.train_rate || ''));
                propertyForm.appendChild(createInput('test_rate', 'number', nodeData.data.test_rate || ''));
                break;
            // 他のノードタイプに応じてプロパティを追加
        }
    }

    document.getElementById('updatePropertiesBtn').onclick = () => updateProperties(nodeId); // プロパティを更新するボタン
    document.getElementById('closeModalBtn').onclick = closePropertyEditor; // モーダルを閉じるボタン

    openModal('propertyEditor'); // プロパティエディターを表示
}

function closePropertyEditor() { // プロパティエディターを閉じる
    closeModal('propertyEditor'); // プロパティエディターを閉じる
}

function createInput(name, type, value) { // 入力要素を生成
    const label = document.createElement('label'); // ラベル要素を作成
    label.textContent = name; // ラベルのテキストを設定
    const input = document.createElement('input'); // 入力要素を作成
    input.type = type; // 入力タイプを設定
    input.name = name; // 入力名を設定
    input.value = value; // 入力値を設定
    label.appendChild(input); // ラベルに入力を追加
    return label;
}

function updateProperties(nodeId) { // プロパティを更新
    const form = document.getElementById('propertyForm'); // プロパティフォーム
    const updatedData = {}; // 更新されたデータ
    const inputs = form.querySelectorAll('input'); // 入力要素を取得
    inputs.forEach(input => { // 入力要素を走査
        updatedData[input.name] = input.value; // 入力値を更新
    });
    editor.updateNodeDataFromId(nodeId, updatedData); // ノードのデータを更新
    closePropertyEditor(); // プロパティエディターを閉じる
}

function runFlow() { // フローを実行
    // const data = editor.export();
    const data = exportWithCategory(); // カテゴリー情報を含めてエクスポート
    console.log(data); // データをログに出力
    
    fetch('/run', { // フローを実行
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // 何を送るか
        body: JSON.stringify(data, null, 2) // データをJSON文字列に変換
    })
    .then(response => { // レスポンスを受け取る。OK表示
        console.log(response.json());
        if (response.status === "error") {
            console.error("Error:", response.message);
        }
      })
    .catch(error => {
          console.error(error);
      });
    
}

function exportFlow() { // フローをエクスポート
  const data = exportWithCategory(); // カテゴリー情報を含めてエクスポート
  console.log(data);
  const formattedJson = JSON.stringify(data, null, 2) // データをJSON文字列に変換
      .replace(/&/g, '&amp;') // エスケープ処理(&を&amp;に変換)
      .replace(/</g, '&lt;') // エスケープ処理(<を&lt;に変換)
      .replace(/>/g, '&gt;'); // エスケープ処理(>を&gt;に変換)
  
  // JSONファイルとしてサーバーに保存
  fetch('/save_json', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
      console.log(result.message);
      Swal.fire({ // SweetAlert2でエクスポート
          title: 'エクスポート',
          html: `<pre style="text-align: left;"><code class="json">${formattedJson}</code></pre>`,
          width: '80%',
          confirmButtonText: 'コピー',
          showCloseButton: true,
          customClass: {
              container: 'swal2-container-left-aligned'
          }
      }).then((result) => { // 結果を取得
          if (result.isConfirmed) { // 結果が確認された場合
              navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => { // クリップボードにコピー
                  Swal.fire({ // コピー完了
                      title: 'コピーしました',
                      icon: 'success',
                      customClass: {
                          container: 'swal2-container-left-aligned'
                      }
                  });
              });
          }
      });
  })
  .catch(error => {
      console.error('Error saving the JSON file:', error);
  });
}


function importFlow() { // フローをインスポート
    // editor.import();
    const jsonFilePath = '/static/export.json'; // パス
    console.log("Attempting to fetch:", jsonFilePath);

    fetch(jsonFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            editor.import(data);
            console.log('Flow imported successfully:', data);
        })
        .catch(error => {
            console.error('Error importing flow:', error);
        });
}

function openModal(modalId) { // モーダルを開く
    const modal = document.getElementById(modalId); // モーダル
    modal.style.display = 'block'; // モーダルを表示
    modal.classList.add('fade-in'); // フェードインクラスを追加
}

function closeModal(modalId) { // モーダルを閉じる
    const modal = document.getElementById(modalId); // モーダル
    modal.style.display = 'none'; // モーダルを非表示
    modal.classList.remove('fade-in'); // フェードインクラスを削除
}

function updateAiAssistant(message) { // AIアシスタントを更新
    const aiAssistantContent = document.getElementById('aiAssistantContent'); // AIアシスタントコンテンツ
    aiAssistantContent.innerHTML += `<p>${message}</p>`; // メッセージを追加
}