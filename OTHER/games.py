class Games:

    def __init__(self, name, player):
        self.name = name;
        self.player = player;

    def __str__(self):
        return self.name + " played by " + self.player

if __name__ == '__main__':
    a = Games('Soccer', 'William');
    print(a)
