# !/bin/python

import argparse
import csv

import matplotlib.pyplot


def main(args):
    if args.delimiter is not None:
        delimiter = args.delimiter
    else:
        delimiter = ";"
    if args.input is not None:
        inputFile = args.input
    else:
        print("Please specify CSV file which should be plotted. Exit program!")
        return
    if args.xlabel is not None:
        xcolumn = args.xlabel
    else:
        xcolumn = 1
    if args.title is not None:
        title = args.title
    else:
        title = "Diagram"
    xlabel = "Default"
    ylabel = list()
    xvalues = list()
    yvalues = list(list())

    with open(inputFile, "r") as fileHandle:
        fileObject = csv.reader(fileHandle, delimiter=delimiter)
        rowCount = 1
        for row in fileObject:
            if rowCount == 1:
                columnCount = 1
                for column in row:
                    if columnCount == xcolumn:
                        xlabel = column
                    else:
                        ylabel.append(column)
                        yvalues.append(list())
                    columnCount += 1
                if len(yvalues) == 0:
                    print("No valid data found. Maybe wrong delimiter? Exit program!")
                    return
            else:
                columnCount = 1
                yColumn = 0
                for column in row:
                    if columnCount == xcolumn:
                        xvalues.append(float(column.replace(',', '.')))
                    else:
                        yvalues[yColumn].append(float(column.replace(',','.')))
                        yColumn += 1
                    columnCount += 1
            rowCount += 1

    matplotlib.pyplot.figure()
    for index in range(0, len(ylabel), 1):
        matplotlib.pyplot.plot(xvalues, yvalues[index], color="b", label=ylabel[index])
    matplotlib.pyplot.grid(True)
    matplotlib.pyplot.legend()
    matplotlib.pyplot.title(title)
    matplotlib.pyplot.xlabel(xlabel)
    if args.output is not None:
        matplotlib.pyplot.savefig(args.output, dpi=500, optimize=True, format='png', transparent=False)
    matplotlib.pyplot.show()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Script for sinus generation or plotting')
    parser.add_argument("-d", "--delimiter", type=str, help="Character used for splitting the colums of the CSV-File")
    parser.add_argument("-x", "--xlabel", type=int, help="Column having the information for the X-Axis")
    parser.add_argument("-i", "--input", type=str, help="Filepath of the CSV-File which should be shown")
    parser.add_argument("-o", "--output", type=str, help="File where the generated plot will be saved as PNG")
    parser.add_argument("-t", "--title", type=str, help="Title used for the Plot")


    main(parser.parse_args())
