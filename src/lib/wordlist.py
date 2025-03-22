import json
f = open('words.txt', 'r')
lst = f.readlines()
lst = list(map(lambda i: i.strip(), lst))
lst.sort()
f.close()

g = open('words.json', 'w')
words = json.dumps(lst)
g.write(words)
g.close()