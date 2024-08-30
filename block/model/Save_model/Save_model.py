from block.block import Block
import torch
import traceback

class Save_model(Block):
    def __init__(self, params=None):
        super().__init__()
        # self.input = [0,1,2,3]
        self.save_path = './checkpoint/best.pth' # パラメータ

    def run(self, input_data=None):
        try:
            model = self.input[0]
            optimizer = self.input[1]
            dataset = self.input[2]
            n_epochs = self.input[3]
            checkpoint = {
                'state_dict': model.to('cpu').state_dict(),
                'model': model.fc,
                'class_to_idx': dataset.dataset.class_to_idx,
                'opt_state': optimizer.state_dict(),
                'num_epochs': n_epochs
            }
            torch.save(checkpoint, self.save_path)

            return {"status": "success"}
        except Exception as error:
            print(f"Error occurred during task execution: {error}")
            print(traceback.format_exc())
            return {"status": "error","message": str(error)}