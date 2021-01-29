import numpy as np
import random as rd

array1 = np.array([[11, 22, 33, 44, 55],
             [66,  77,  88,  99, 100]])
#print("Original arrays:")
#print(array1)
i = [1,3,0,4,2]
j = [1, 0]
result = array1[:,i]
#print("New array:")
#print(result)
result2 = array1[j,:]
#print("On rows:")
#print(result2)

def dims(matrix):
    d = np.shape(matrix)
    if len(d) == 1:
        d = (1, d[0])

    return d

def roll(matrix):
    dim = dims(matrix)
    if dim[0] == 1:
        # if vector : matrix of 1 row
        matrix = np.roll(matrix, -1)
        matrix[-1] = matrix[-2] + 1
    else:
        matrix = np.roll(matrix, -1)
        try:
            matrix[-1][-1] = matrix[-1][-2] + 1
        except:
            matrix[-1][0] = matrix[-2][0] + 1
    return matrix

def create_increasing(col, row):
    if col == 1:
        new = np.array([i for i in range(1, row + 1)])
    else:
        new = np.arange(row * col).reshape((col, row))
        new = roll(new)
    return new

def create_matrix(row_min=3, row_max=7, col_min=3, col_max=7):
    row = rd.randint(row_min, row_max)
    col = rd.randint(col_min, col_max)

    matrix = create_increasing(col, row)

    return matrix

def shiftr(matrix, one, two):
    matrix[[one, two],:] = matrix[[two, one],:]
    return matrix

def shiftc(matrix, one, two):
    matrix[:,[one, two]] = matrix[:,[two, one]]
    return matrix

def dim_match(m1, m2):
    dim1 = dims(m1)
    dim2 = dims(m2)

    if dim1[0] == 1:
        dim1 = (0, dim1[1])

    if dim2[0] == 1:
        dim2 = (0, dim2[1])

    if (sh1[0] != sh2[0]) or (sh1[1] != sh2[1]):
        return False
    else:
        return True

def equals(m1, m2):
    try:
        dim = dims(m1)

        if dim[0] == 1:
            for i in range(dim[0]):
                if m1[i] != m2[i]:
                    return False
        else:
            for i in range(dim[0]):
                for j in range(dim[1]):
                    if m1[i][j] != m2[i][j]:
                        return False

        return True
    except:
        return False

def is_ordered(matrix):
    dim = dims(matrix)

    compared = create_increasing(dim[0], dim[1])
    return equals(matrix, compared)

def mix(matrix, number_of_times=-1):
    dim = dims(matrix)
    if number_of_times == -1:
        number_of_times = rd.randint(10, 25)

    for i in range(number_of_times):
        dimension = rd.randint(0, 1)
        one = rd.randint(0, dim[dimension] - 1)

        while True:
            two = rd.randint(0, dim[dimension] - 1)
            if two != one:
                break

        if dimension == 0:
            matrix = shiftr(matrix, one, two)
        else:
            matrix = shiftc(matrix, one, two)

    return matrix, number_of_times

def guesses(matrix, solution):
    while True:
        change = input("NEW MOVE\n>>> ")
        if change.lower() == "return":
            print("GAME OVER\n")
            return
        elif change.lower() == "check":
            correct = equals(matrix, solution)
            if correct:
                print("IT IS CORRECT. CONGRATS.\nGAME OVER")
                return
            else:
                retry = input("IT IS INCORRECT.\nKeep trying ? Yes or No\n>>> ")
                if retry.lower() == "no":
                    print("GAME OVER \n")
                    return

        else:
            change = change.strip().split()
            if len(change) != 3:
                print("incorrect format. only 3 args separated by 1 space")
            else:
                try:
                    dim = change[0]
                    one = int(change[1])
                    two = int(change[2])

                    if dim == 'r' or dim == 'c':
                        row, col = dims(matrix)
                        if dim == 'r':
                            to_swap = row

                        elif dim == 'c':
                            to_swap = col

                        if one == -1:
                            one = to_swap -1
                        else:
                            one -=1

                        if two == -1:
                            two = to_swap -1
                        else:
                            two -=1

                        if (one < 0 or two < 0) or (to_swap <= one or to_swap <= two):
                            print("incorret swap: can only be from {} to {}".format(1, to_swap))
                        elif one == two:
                            print("incorrect swap: useless to swap the line {} with itself !".format(one+1))
                        else:
                            if to_swap == row:
                                matrix = shiftr(matrix, one, two)
                                print("you swapt the rows {} and {} :".format(one + 1, two + 1))
                            else:
                                matrix = shiftc(matrix, one, two)
                                print("you swapt the columns {} and {} :".format(one + 1, two + 1))
                            print(matrix)
                    else:
                        print("incorrect dimension (first number to type). 'r' for rows, 'c' for columns")
                except:
                    print("incorrect format. 'r' or 'c' for the 1st element, numbers for the 2nd and 3rd")

        print()



if __name__ == "__main__":
    m_mix = create_matrix()
    m_begin = m_mix.copy()
    m_mix, mixes = mix(m_mix, 10)

    print("The final matrix should be this one :")
    print(m_begin)

    print("You start from this one :")
    print(m_mix)


    print("\nYou can swap columns and rows, as many times as you need. Good luck.")
    print("Tip : it can be done in {} swaps !".format(mixes))


    print(m_mix)

    guesses(m_mix, m_begin)
