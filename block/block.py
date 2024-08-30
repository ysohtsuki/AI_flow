class Block:
    def __init__(self):
        # self.input = []  
        self.input_type = []
        self.inputs_type = []
        self.outputs_type = []
        # self.next_inputs = []
        self.next_inputs_number = []
        self.output = None
        self.error_callback = None
        self.class_name = self.__class__.__name__
        self.data = []

    def run(self, input_data):
        """ 処理を実行するメソッド。オーバーライドが必要 """
        raise NotImplementedError("Each block must implement a 'run' method.")

    def set_error_callback(self, class_name, callback):
        """エラー通知のためのコールバック関数を設定する。"""
        self.class_name = class_name
        self.error_callback = callback

    def validate_input(self, input_types,input_indexes):
        """入力データの型を検証するメソッド。"""
        # print("inputs_type",self.inputs_type)
        # print(input_types)
        for i in input_indexes:
            # print("入力されたtype:",type(input_data[i]), "正しいtype:",self.input_type[i])
            if input_types[i] != self.inputs_type[i]["type"]:
                error_message = f"{self.class_name}:入力データは{self.inputs_type}型である必要があります。現在は{input_types}です。"
                if self.error_callback:
                    self.error_callback(error_message)
                raise TypeError(error_message)
            
    def get_data(self):
        return self.data

    def temporary_initial_value(self,inputs_number):
        self.input = [None for _ in range(inputs_number)]
        