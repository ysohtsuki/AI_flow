from block.block import Block
import torchvision.transforms as transforms
import json
import traceback

class Pipeline(Block):
    def __init__(self, params):
        super().__init__()
        # self.input = []
        self.selected_options = json.loads(params['transforms'])
        # print("Pipeline_params",self.selected_options)
        self.resize = (80, 80) # パラメータ
        self.normalize_params = ((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))  # 正規化のためのパラメータ
        self.color_jitter_params = {"brightness": 0.2, "contrast": 0.2, "saturation": 0.2, "hue": 0.1}  # カラージッターのパラメータ

    def run(self, input_data=None):
        try:
            
            transform_list = []
    
            for option in self.selected_options:
                # print("ouption",option)
                if option == "resize" and self.resize is not None:
                    transform_list.append(transforms.Resize(self.resize))
                elif option == "random_horizontal_flip":
                    transform_list.append(transforms.RandomHorizontalFlip(p=0.5))
                elif option == "color_jitter" and self.color_jitter_params is not None:
                    transform_list.append(transforms.ColorJitter(**self.color_jitter_params))
                elif option == "to_tensor":
                    transform_list.append(transforms.ToTensor())
                elif option == "normalize" and self.normalize_params is not None:
                    transform_list.append(transforms.Normalize(*self.normalize_params))
            
            transform_pipeline = transforms.Compose(transform_list)
            self.output = [transform_pipeline]

            return {"status": "success"}
        except Exception as error:
            print(f"Error occurred during task execution: {error}")
            print(traceback.format_exc())
            return {"status": "error","message": str(error)}