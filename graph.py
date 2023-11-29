import pandas as pd
import numpy as np
from bokeh.plotting import figure
from bokeh.io import output_file, show, output_notebook
from bokeh.models import CustomJS
from bokeh.models.widgets import CheckboxGroup
from bokeh.layouts import row
from bokeh.palettes import Viridis4
from bokeh.models.annotations import Title, Legend
from bokeh import events

df = pd.read_csv("data/TSLA.csv")

df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m-%d')

p = figure(x_axis_type='datetime', min_width=800)
aline = p.line(df['Date'], df['High'], line_width=2, color=Viridis4[0])
bline = p.line(df['Date'], df['Low'], line_width=2, color=Viridis4[1])
cline = p.line(df['Date'], df['Open'], line_width=2, color=Viridis4[2])
dline = p.line(df['Date'], df['Close'], line_width=2, color=Viridis4[3])

p.yaxis.axis_label = 'Price'
p.xaxis.axis_label = 'Time Span'

legend = Legend(items=[
    ("High Price",   [aline]),
    ("Low Price", [bline]),
    ("Open Price", [cline]),
    ("Close Price", [dline])
], location=(0, 450))

t = Title()
t.text = 'Tesla Stock Market Analysis'
p.title = t

p.add_layout(legend, 'center')
p.sizing_mode = "scale_both"

checkboxes = CheckboxGroup(labels=list(['High Price', 'Low Price', 'Open Price', 
                          'Close Price']), active=[0, 1, 2, 3])
callback = CustomJS(code="""aline.visible = false; // aline and etc.. are 
                            bline.visible = false; // passed in from args
                            cline.visible = false; 
                            dline.visible = false;
                            // cb_obj is injected in thanks to the callback
                            if (cb_obj.active.includes(0)){aline.visible = true;} 
                                // 0 index box is aline
                            if (cb_obj.active.includes(1)){bline.visible = true;} 
                                // 1 index box is bline
                            if (cb_obj.active.includes(2)){cline.visible = true;} 
                                // 2 index box is cline etc...
                            if (cb_obj.active.includes(3)){dline.visible = true;}""",
                    args={'aline': aline, 'bline': bline, 'cline': cline, 'dline': dline})
checkboxes.js_on_change("active", callback)
output_file('Tesla_Stock_Widget.html')
show(row(p, checkboxes))