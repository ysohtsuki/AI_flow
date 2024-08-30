from block.block import Block
import torch
import traceback
from tqdm import tqdm
import time

class Train_model(Block):
    def __init__(self, params):
        super().__init__()
        # self.input = [0,1,2,3,4]
        self.batch_size = int(params["batch_size"]) # パラメータ
        self.n_epochs = int(params["n_epochs"]) # パラメータ
        self.device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu") # パラメータ

    def run(self, input_data=None):
        try:
            trainloader = self.input[0]
            model = self.input[1]
            criterion= self.input[2]
            optimizer= self.input[3]
            scheduler= self.input[4]

            losses = []
            accuracies = []
            test_accuracies = []
            best_acc = 0.0

            model.to(self.device)
            model.train()
            for epoch in range(self.n_epochs):
                since = time.time()
                running_loss = 0.0
                running_correct = 0.0

                for i, data in enumerate(tqdm(trainloader), 0):
                    inputs, labels = data
                    inputs = inputs.to(self.device)
                    labels = labels.to(self.device)
                    optimizer.zero_grad()

                    outputs = model(inputs)
                    _, predicted = torch.max(outputs.data, 1)
                    loss = criterion(outputs, labels)
                    loss.backward()
                    optimizer.step()

                    running_loss += loss.item()
                    running_correct += (labels == predicted).sum().item()

                epoch_duration = time.time() - since
                epoch_loss = running_loss / len(trainloader)
                epoch_acc = 100 / self.batch_size * running_correct / len(trainloader)
                print("Epoch %s, duration: %d s, loss: %.4f, acc: %.4f" % (epoch+1, epoch_duration, epoch_loss, epoch_acc))

                losses.append(epoch_loss)
                accuracies.append(epoch_acc)

                scheduler.step(epoch_acc)

            print('Finished Training')
            self.output = [model, losses, accuracies, self.n_epochs, self.device]

            return {"status": "success"}
        except Exception as error:
            print(f"Error occurred during task execution: {error}")
            print(traceback.format_exc())
            return {"status": "error","message": str(error)}