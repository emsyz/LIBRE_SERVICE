class ListG:

    def __init__(self, games = None):
        if type(games) is list:
            dic = {}
            lst = []
            for gm in games:
                if type(gm) is not Game:
                    self.games = []
                    self.dico = {}
                    return
                else:
                    lst.append(Game)
                    try:
                        dic[gm.type()].append(gm.name())
                    except:
                        dic[gm.type()] = [gm.name()]

            self.dico = dic
            self.games = lst

        else:
            self.games = []
            self.dico = {}

    def __str__(self):
        toreturn = ">>> LIST OF GAMES <<<\n"

        for i in self.dico:
            toreturn += "- {} type:\n".format(i)

            for j in self.dico[i]:
                toreturn += '{}, '.format(j)

            toreturn = toreturn[:-2]
            toreturn += '\n' * 2

        return toreturn

class Game:

    def __init__(self, name, type):
        self.__name = name
        self.__type = type

    def name(self):
        return self.__name

    def type(self):
        return self.__type
