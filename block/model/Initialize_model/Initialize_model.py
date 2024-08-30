from block.block import Block
import torchvision.models as models
import torch.nn as nn
import torch.optim as optim
import traceback
import torchvision
from torchvision.models import ResNet18_Weights

class Initialize_model(Block):
    def __init__(self, params=None):
        super().__init__()
        self.num_labels = 2 # パラメータ
        self.learning_rate = 0.01 # パラメータ
        # self.input = [0]

    def run(self, input_data=None):
        try:
            # model = models.resnet18(pretrained=True)
            model = torchvision.models.resnet18(weights=ResNet18_Weights.IMAGENET1K_V1)
            num_ftrs = model.fc.in_features
            model.fc = nn.Linear(num_ftrs, self.num_labels)

            criterion = nn.CrossEntropyLoss() # パラメータ
            optimizer = optim.SGD(model.parameters(), lr=self.learning_rate, momentum=0.9) # パラメータ
            scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='max', patience=3, threshold=0.9) # パラメータ

            self.output = [model, criterion, optimizer, scheduler]

            return {"status": "success"}
        except Exception as error:
            print(f"Error occurred during task execution: {error}")
            print(traceback.format_exc())
            return {"status": "error","message": str(error)}