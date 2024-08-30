from block.block import Block  
class Normalization(Block):
    def __init__(self, params):
        super().__init__()
        # print("params",params["name"])

    def run(self):
        sum = self.input[0] + self.input[1]
        self.output = sum
        print("sum", sum)
        print("Normalization")
        print("Normalization input",self.input)
        # return 0