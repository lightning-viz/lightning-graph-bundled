from lightning import Lightning
from numpy import random, ceil, array

lgn = Lightning()

x = random.randn(10)
y = random.randn(10)
mat = random.rand(10,10)
mat[mat>0.75] = 0

lgn.graphbundled(x, y, mat, group=group)