import json

with open('d1.json', 'r') as f:
  d1 = json.load(f)

d2 = {'Communities': [], 'Years': [], 'F1': {}, 'F2': {}, 'F3': {}, 'F4': {}, 'A1.1': {}, 'A1.2': {}, 'A2': {}, 'I1': {}, 'I2': {}, 'I3': {}, 'R1.1': {}, 'R1.2': {}, 'R1.3': {}}

for binding in d1['results']['bindings']:
    p = binding['p']['value']
    c = binding['c']['value']
    y = binding['y']['value']
    t = binding['t']['value']
    r = binding['rel']['value'] # https://w3id.org/fair/fip/terms/declares-current-use-of, https://w3id.org/fair/fip/terms/declares-planned-use-of

    if c not in d2['Communities']:
        d2['Communities'].append(c)
    if y not in d2['Years']:
        d2['Years'].append(y)

    if c not in d2[p]:
        c_data = {}
        d2[p][c] = c_data
    else:
        c_data = d2[p][c]

    if y not in c_data:
        if r == 'https://w3id.org/fair/fip/terms/declares-current-use-of':
            y_data = 1
        elif r == 'https://w3id.org/fair/fip/terms/declares-planned-use-of':
            y_data = -1
    else:
        y_data = c_data[y]
        if y_data == -1 and r == 'https://w3id.org/fair/fip/terms/declares-current-use-of':
            y_data = 0
        elif y_data == 1 and r == 'https://w3id.org/fair/fip/terms/declares-planned-use-of':
            y_data = 0

    c_data[y] = y_data

with open('d2.json', 'w') as f:
  json.dump(d2, f, indent = 2)

