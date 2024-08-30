from block.block import Block
import torch
import matplotlib
matplotlib.use('Agg') # matplotlibのバックエンドを変更する
import matplotlib.pyplot as plt
import numpy as np
from sklearn.metrics import confusion_matrix, classification_report, roc_curve, auc
from tqdm import tqdm
import seaborn as sns
import traceback

class Evaluate_and_plot(Block):
    def __init__(self, params={'num_labels': '2'}):
        super().__init__()
        self.num_labels = params["num_labels"] # パラメータ
        print(params)
        print(self.num_labels)

    def run(self, input_data=None):
        try:
            def plot_confusion_matrix(y_true, y_pred, classes):
                # 混同行列を計算
                cm = confusion_matrix(y_true, y_pred)

                # 図を作成し、混同行列をヒートマップとして表示
                fig, ax = plt.subplots(figsize=(8, 8))
                sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=classes, yticklabels=classes)

                # 軸ラベルを設定
                ax.set_ylabel('Actual')  # 実際のクラス
                ax.set_xlabel('Predicted')  # 予測されたクラス

                # 混同行列の画像を保存
                plt.savefig('result/confusion_matrix.png')
                # plt.close()

                # 図を表示
                # plt.show()

            def classification_metrics(y_true, y_pred, classes):
                # 分類の結果をレポートとして表示
                print(classification_report(y_true, y_pred, target_names=classes))

            def plot_roc_curve(y_true, y_scores):
                # ROC曲線のデータを計算
                fpr, tpr, _ = roc_curve(y_true, y_scores)
                roc_auc = auc(fpr, tpr)

                # ROC曲線をプロット
                plt.figure(figsize=(8, 8))
                plt.plot(fpr, tpr, color='darkorange', lw=2, label='ROC curve (area = %0.2f)' % roc_auc)

                # ランダムな分類器のラインを追加
                plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')

                # 軸のラベルとタイトルを設定
                plt.xlabel('False Positive Rate')
                plt.ylabel('True Positive Rate')
                plt.title('Receiver Operating Characteristic Curve')

                # 凡例を追加
                plt.legend(loc="lower right")

                # ROC曲線の画像を保存
                plt.savefig('result/roc_curve.png')
                # plt.close()

                # 図を表示
                # plt.show()

            y_true = []
            y_pred = []
            y_scores = []

            model = self.input[0]
            testloader = self.input[1]
            device = self.input[2]

            model.eval()
            with torch.no_grad():
                for i, data in enumerate(tqdm(testloader), 0):
                    images, labels = data
                    images = images.to(device)
                    labels = labels.to(device)

                    outputs = model(images)
                    _, predicted = torch.max(outputs.data, 1)

                    y_true.extend(labels.cpu().numpy())
                    y_pred.extend(predicted.cpu().numpy())

                    if self.num_labels == 2:
                        y_scores.extend(outputs[:, 1].cpu().numpy())

            test_acc = 100.0 * sum(np.array(y_true) == np.array(y_pred)) / len(y_true)
            print('Accuracy of the network on the test images: %.2f %%' % (test_acc))

            class_names = list(testloader.dataset.class_to_idx.keys())
            plot_confusion_matrix(y_true, y_pred, class_names)
            classification_metrics(y_true, y_pred, class_names)

            if self.num_labels == 2:
                plot_roc_curve(y_true, y_scores)
            
            self.data = test_acc

            return {"status": "success"}
        except Exception as error:
            print(f"Error occurred during task execution: {error}")
            print(traceback.format_exc())
            return {"status": "error","message": str(error)}