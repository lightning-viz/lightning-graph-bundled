from lightning import Lightning
from numpy import random, ceil, array

lgn = Lightning()

mat = random.rand(10,10)
mat[mat>0.1] = 0
group = (random.rand(10) * 5).astype('int')

lgn.graphbundled(mat, group=group)