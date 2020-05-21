import math

def getImgPtg(imgSize, selectSize):
    assert imgSize != 0, "Image size should be nonzero"
    return str((selectSize/imgSize) * 100) + "%"

if __name__=="__main__":
    imgSize = int(input("Enter size of image dimension:"))
    selectSize = int(input("Enter size of selection dimension:"))
    print("The % of the selection on the image is: " + getImgPtg(imgSize, selectSize))
