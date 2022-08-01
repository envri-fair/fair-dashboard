import json

with open('d1.json', 'r') as f:
  d1 = json.load(f)

d2 = {'Communities': [], 
    'Years': [], 
    'Principles': {
        'F1': {
            'uri': 'https://www.go-fair.org/fair-principles/f1-meta-data-assigned-globally-unique-persistent-identifiers/',
            'label': 'F1',
            'definition': '(Meta) data are assigned globally unique and persistent identifiers'
        },
        'F2': {
            'uri': 'https://www.go-fair.org/fair-principles/f2-data-described-rich-metadata/',
            'label': 'F2',
            'definition': 'Data are described with rich metadata'
        },
        'F3': {
            'uri': 'https://www.go-fair.org/fair-principles/f3-metadata-clearly-explicitly-include-identifier-data-describe/',
            'label': 'F3',
            'definition': 'Metadata clearly and explicitly include the identifier of the data they describe'
        },
        'F4': {
            'uri': 'https://www.go-fair.org/fair-principles/f4-metadata-registered-indexed-searchable-resource/',
            'label': 'F4',
            'definition': '(Meta)data are registered or indexed in a searchable resource'
        },
        'A1.1': {
            'uri': 'https://www.go-fair.org/fair-principles/a1-1-protocol-open-free-universally-implementable/',
            'label': 'A1.1',
            'definition': 'The protocol is open, free and universally implementable'
        },
        'A1.2': {
            'uri': 'https://www.go-fair.org/fair-principles/a1-2-protocol-allows-authentication-authorisation-required/',
            'label': 'A1.2',
            'definition': 'The protocol allows for an authentication and authorisation where necessary'
        },
        'A2': {
            'uri': 'https://www.go-fair.org/fair-principles/a2-metadata-accessible-even-data-no-longer-available/',
            'label': 'A2',
            'definition': 'Metadata should be accessible even when the data is no longer available'
        },
        'I1': {
            'uri': 'https://www.go-fair.org/fair-principles/i1-metadata-use-formal-accessible-shared-broadly-applicable-language-knowledge-representation/',
            'label': 'I1',
            'definition': '(Meta)data use a formal, accessible, shared, and broadly applicable language for knowledge representation'
        },
        'I2': {
            'uri': 'https://www.go-fair.org/fair-principles/i2-metadata-use-vocabularies-follow-fair-principles/',
            'label': 'I2',
            'definition': '(Meta)data use vocabularies that follow the FAIR principles'
        },
        'I3': {
            'uri': 'https://www.go-fair.org/fair-principles/i3-metadata-include-qualified-references-metadata/',
            'label': 'I3',
            'definition': '(Meta)data include qualified references to other (meta)data'
        },
        'R1.1': {
            'uri': 'https://www.go-fair.org/fair-principles/r1-1-metadata-released-clear-accessible-data-usage-license/',
            'label': 'R1.1',
            'definition': '(Meta)data are released with a clear and accessible data usage license'
        },
        'R1.2': {
            'uri': 'https://www.go-fair.org/fair-principles/r1-2-metadata-associated-detailed-provenance/',
            'label': 'R1.2',
            'definition': '(Meta)data are associated with detailed provenance'
        },
        'R1.3': {
            'uri': 'https://www.go-fair.org/fair-principles/r1-3-metadata-meet-domain-relevant-community-standards/',
            'label': 'R1.3',
            'definition': '(Meta)data meet domain-relevant community standards'
        }
    },
    'Demonstrators': {
        'I1': [{
            'label': 'SIOS netCDF-LD demonstrator',
            'creator': 'Lara Ferrighi',
            'date': '2020-04-29',
            'url': 'https://mybinder.org/v2/gh/ferrighi/netcdf-ld-prototype.git/HEAD'
        }],
        'I2': [{
            'label': 'BODC vocabularies demonstrator',
            'creator': 'Alexandra Kokkinaki',
            'date': '2020-01-23',
            'url': 'https://mybinder.org/v2/gh/envri-fair/vocabularies-demonstrator.git/master'
        }],
        'R1.2': [{
            'label': 'IAGOS provenance demonstrator',
            'creator': 'Damien Boulanger',
            'date': '2020-12-11',
            'url': 'https://github.com/envri-fair/iagos-prov'
        },{
            'label': 'ACTRIS provenance demonstrator',
            'creator': 'Markus Stocker',
            'date': '2019-12-06',
            'url': 'https://mybinder.org/v2/gh/envri-fair/provenance-demonstrator.git/master'
        }]
    },
    'F1': {}, 'F2': {}, 'F3': {}, 'F4': {}, 'A1.1': {}, 'A1.2': {}, 'A2': {}, 'I1': {}, 'I2': {}, 'I3': {}, 'R1.1': {}, 'R1.2': {}, 'R1.3': {}}

for binding in d1['results']['bindings']:
    p = binding['p']['value']
    c = binding['c']['value']
    y = binding['y']['value']
    t = binding['t']['value']
    r = binding['rel']['value'] # https://w3id.org/fair/fip/terms/declares-current-use-of, https://w3id.org/fair/fip/terms/declares-planned-use-of

    if y ==  '2022': 
        continue

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
        y_data = [0, 1]
        if r == 'https://w3id.org/fair/fip/terms/declares-current-use-of':
            y_data[0] = 1
    else:
        y_data = c_data[y]
        y_data[1] += 1
        if r == 'https://w3id.org/fair/fip/terms/declares-current-use-of':
            y_data[0] += 1

    c_data[y] = y_data

for community in d2['Communities']:
    if community not in d2['R1.3']:
        d2['R1.3'][community] = {} 
    for year in d2['Years']:
        if year not in d2['R1.3'][community]:
            d2['R1.3'][community][year] = [0, 0]
        for principle in d2['Principles'].keys():
            if principle == 'R1.3':
                continue
            if community in d2[principle] and year in d2[principle][community]:
                d2['R1.3'][community][year][0] += d2[principle][community][year][0]
                d2['R1.3'][community][year][1] += d2[principle][community][year][1]

with open('d2.json', 'w') as f:
  json.dump(d2, f, indent = 2)

