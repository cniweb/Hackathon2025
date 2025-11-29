# !/bin/python

import argparse
import os
import random
import math

import matplotlib.pyplot


def main(args):
    timebase = list()
    data = list()
    segments = list()
    segment_lengths = list()

    for index in range(0, 50):
        segments.append(5.0)
        segment_lengths.append(0.3)

        segments.append(1.0)
        segment_lengths.append(70)

        segments.append(0.0)
        segment_lengths.append(30)


    if args.noise is not None:
        noise = args.noise
    else:
        noise = 0.0
    if args.timebase is not None:
        delta_t = args.timebase
    elif args.samples is not None:
        delta_t = 1.0 / args.samples
    else:
        delta_t = 0.020

    index = 0
    time = 0
    for segment in segments:
        for timestamp in range(0, math.ceil((1 / delta_t) * segment_lengths[index])):
            time += delta_t
            timebase.append(time)
            data.append(segment + random.uniform(0.0, noise * segment))
        index += 1

    if args.output:
        with open(args.output, "w+") as file_handle:
            file_handle.write("Time(s); Amplitude" + '\n' )
            index = 0
            for timestamp in timebase:
                file_handle.write(str(timestamp) + "; " + str(data[index]) + '\n' )
                index += 1

    if args.plot:
        matplotlib.pyplot.figure()
        matplotlib.pyplot.plot(timebase, data, color="b", label="Value")
        matplotlib.pyplot.ylabel('Amplitude')
        matplotlib.pyplot.xlabel('Time(s)')

        matplotlib.pyplot.show()


if __name__ == "__main__":
    PARSER = argparse.ArgumentParser(description='Script for sinus generation or plotting')
    PARSER.add_argument("-t", "--timebase", type=float, help="Timebase of the values in Seconds")
    PARSER.add_argument("-s", "--samples", type=dict, help="Number of Samples Per second")
    PARSER.add_argument("-n", "--noise", type=float, help="Noise of the generated sinus in %% (Range 0.0 to 1.2)")
    PARSER.add_argument("-plot", help="Plot signal to a Figure via Pyplot", action="store_true")
    PARSER.add_argument("-o", "--output", type=str, help="File where the generated samples will be saved as CSV")

    main(PARSER.parse_args())
