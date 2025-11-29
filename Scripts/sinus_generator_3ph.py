# !/bin/python

import argparse
import os
import random

import numpy
import matplotlib.pyplot


def main(args):
    angle = list()
    sinus_L1 = list()
    sinus_L2 = list()
    phase_shift_L2 = 120 / 360 * 2 * numpy.pi
    sinus_L3 = list()
    phase_shift_L3 = 240 / 360 * 2 * numpy.pi
    periods = args.periods
    samples = args.samples

    if args.amplitude is not None:
        amplitude = args.amplitude
    else:
        amplitude = 1
    if args.noise is not None:
        noise = args.noise
    else:
        noise = 0.0

    if periods is None:
        print("Number of periods not specified. Exit script!")
        return
    elif samples is None:
        print("Number of Samples per Period not specified. Exit script!")
        return
    else:
        for value in numpy.arange(0, periods * 2 * numpy.pi, 2 * numpy.pi / samples):
            angle.append(value)

        for value in angle:
            sinus_L1.append(amplitude * numpy.sin(value) + random.uniform(0.0, amplitude * noise))
            sinus_L2.append(amplitude * numpy.sin(value + phase_shift_L2) + random.uniform(0.0, amplitude * noise))
            sinus_L3.append(amplitude * numpy.sin(value + phase_shift_L3) + random.uniform(0.0, amplitude * noise))

        if args.output:
            with open(args.output, "w+") as fileHandle:
                fileHandle.write("Angle(rad); Amplitude_L1; Amplitude_L2; Amplitude_L3" + os.linesep)
                index = 0
                for value in angle:
                    fileHandle.write(str(value) + "; " + str(sinus_L1[index]) + "; " + str(sinus_L2[index]) + "; " + str(sinus_L3[index]) + os.linesep)
                    index += 1

        if args.plot:
            matplotlib.pyplot.figure()
            matplotlib.pyplot.plot(angle, sinus_L1, color="b", label="L1")
            matplotlib.pyplot.plot(angle, sinus_L2, color="r", label="L2")
            matplotlib.pyplot.plot(angle, sinus_L3, color="g", label="L3")
            matplotlib.pyplot.ylabel('Amplitude')
            matplotlib.pyplot.xlabel('Angle(rad)')
            matplotlib.pyplot.legend()

            matplotlib.pyplot.show()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Script for sinus generation or plotting')
    parser.add_argument("-p", "--periods", type=int, help="Number of Periods where samples should be generated")
    parser.add_argument("-s", "--samples", type=int, help="Number of Samples generated at each period")
    parser.add_argument("-a", "--amplitude", type=int, help="Amplitude of the generated sinus (Default is 1)")
    parser.add_argument("-n", "--noise", type=float, help="Noise of the generated sinus in %% (Range 0.0 to 1.0)")
    parser.add_argument("-plot", help="Plot signal to a Figure via Pyplot", action="store_true")
    parser.add_argument("-o", "--output", type=str, help="File where the generated samples will be saved as CSV")

    main(parser.parse_args())
