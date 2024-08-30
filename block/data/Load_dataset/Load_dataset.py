from block.block import Block
import traceback
import torch
import torchvision


class Load_dataset(Block):
    def __init__(self, params=None):
        super().__init__()
        self.batch_size = 64 # パラメータ
        self.dataset_dir = "./data/" # パラメータ
        # self.input = [0,1]

    def run(self, input_data=None):
        try:
            train_transform = self.input[0] 
            test_transform = self.input[1]

            print("input",train_transform,test_transform)

            train_dataset = torchvision.datasets.ImageFolder(root=self.dataset_dir + "train", transform=train_transform)
            trainloader = torch.utils.data.DataLoader(train_dataset, batch_size=self.batch_size, shuffle=True, num_workers=2)

            test_dataset = torchvision.datasets.ImageFolder(root=self.dataset_dir + "test", transform=test_transform)
            testloader = torch.utils.data.DataLoader(test_dataset, batch_size=self.batch_size, shuffle=False, num_workers=2)

            # print("load_data_output",trainloader, testloader)
            self.output = [trainloader, testloader]

            return {"status": "success"}
        except Exception as error:
            print(f"Error occurred during task execution: {error}")
            print(traceback.format_exc())
            return {"status": "error","message": str(error)}