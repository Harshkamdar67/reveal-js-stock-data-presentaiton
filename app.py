from flask import Flask, render_template, jsonify
import csv
from io import StringIO
from bokeh.embed import server_document

app = Flask(__name__)

# Load CSV data
def load_csv_data(filename):
    with open(filename, 'r') as file:
        return list(csv.DictReader(file))

# Route to serve the HTML page
@app.route('/')
def index():
    return render_template('reveal.html')

# Route to serve stock data as JSON
@app.route('/stocks')
def get_stocks():
    aapl_data = load_csv_data('data/AAPL.csv')
    googl_data = load_csv_data('data/GOOG.csv')
    msft_data = load_csv_data('data/MSFT.csv')
    tsla_data = load_csv_data('data/TSLA.csv')
    ibm_data = load_csv_data('data/IBM.csv')
    amzn_data = load_csv_data('data/AMZN.csv')
    return jsonify({'AAPL': aapl_data, 'GOOGL': googl_data, 'MSFT': msft_data, 'TSLA':tsla_data, 'IBM' : ibm_data, 'AMZN' : amzn_data})


if __name__ == '__main__':
    app.run(debug=True , port=1232)
