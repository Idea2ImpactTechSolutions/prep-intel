import time
import os
import pandas as pd
from pypeds import ipeds


def collect_hd_table():
    print(" 1. Collecting IPEDS archives")
    # YEARS = [2019,2020]
    YEARS = [2020]
    hd = ipeds.HD(years=YEARS)

    print(f"\n 2. Extracting HD for {YEARS}")
    hd.extract()
    df = hd.load()
    print(df)

    df.to_feather("hd2020.feather")


if __name__ == '__main__':
    collect_hd_table()
