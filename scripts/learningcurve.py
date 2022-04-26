#!/usr/bin/env python
# -*- coding: utf-8 -*-

# In[1]:


import matplotlib
import matplotlib.pyplot as plt

plt.xkcd()


# In[3]:


font = {"size": 22}

matplotlib.rc("font", **font)


# In[4]:


import numpy as np

x = np.arange(0, 1, 0.1)


# In[5]:


y1 = 40 * x * x + 2
y2 = 2 * x * x + 5

y3 = np.array([3, 3.1, 3.2, 1.5, 1.6, 3, 3.7, 7.5, 7.75, 8, 100])


# In[6]:


x_ = np.array([0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.61, 0.7, 0.8, 0.9])


# In[7]:


fig, axs = plt.subplots(1, 1, figsize=(16, 10))

ax = axs

ax.plot(x, y1)
ax.plot(x, y2)
ax.plot(x_, y3)

ax.set_ylim(0, 10)

ax.legend(["Word", "LaTeX", "Markdown"], loc="upper left")

ax.annotate("WHEN YOU START\n USING MAKEFILES", xy=(0.2, 3), arrowprops=dict(arrowstyle="->"), xytext=(0.025, 1))

ax.annotate("WHEN YOU START USING\n UNSUPPORTED SYNTAX", xy=(0.6, 3.7), arrowprops=dict(arrowstyle="->"), xytext=(0.30, 4))

ax.annotate("WHEN YOU DISCOVER\n    PANDOCFILTERS", xy=(0.61, 7.5), arrowprops=dict(arrowstyle="->"), xytext=(0.61, 4.5))

ax.annotate("WHEN YOU REALIZE YOU \nHAVE TO LEARN HASKELL", xy=(0.8, 8), arrowprops=dict(arrowstyle="->"), xytext=(0.45, 8.5))

ax.get_xaxis().set_ticks([])
ax.get_yaxis().set_ticks([])

ax.set_xlabel("DOCUMENT COMPLEXITY")
ax.set_ylabel("IMPLEMENTATION DIFFICULTY")

# ax.set_title("Skills required to write a paper in Word, LaTeX and Markdown")

plt.savefig("../images/learningcurve")


# In[ ]:


# In[ ]:
