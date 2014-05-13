tables = ["2008-Table1.csv",
          "2009-Table1.csv",
          "2010-Table1.csv",
          "2011-Table1.csv",
          "2012-Table1.csv",
          "2013-Table1.csv",]
for table in tables:
    f = open(table, 'r')
    text = f.read()
    f.close()
    text = text.replace("Rotorua*", "Rotorua")
    f = open(table, 'w')
    f.write(text)
    f.close()

print "DONE ROTORUA"

for table in tables:
    f = open(table, 'r')
    text = f.read()
    f.close()
    text = text.replace("Mystery Creek Events Centre,Hamilton", "Mystery Creek Events Centre, Hamilton")
    f = open(table, 'w')
    f.write(text)
    f.close()

print "DONE MYSTERY CREEK"

for table in tables:
    f = open(table, 'r')
    text = f.read()
    f.close()
    text = text.replace("Brisbane Convention & Exhibition Centre", "Brisbane Convention and Exhibition Centre")
    f = open(table, 'w')
    f.write(text)
    f.close()

print "DONE BRISBANE CONVENTION"

for table in tables:
    f = open(table, 'r')
    text = f.read()
    f.close()
    text = text.replace("State Netball and Hockey Centre,Melbourne", "State Netball and Hockey Centre, Melbourne")
    f = open(table, 'w')
    f.write(text)
    f.close()

print "DONE STATE AND HOCKEY"

for table in tables:
    f = open(table, 'r')
    text = f.read()
    f.close()
    text = text.replace("Stadium Southland Velodrome,Invercargill", "Invercargill ILT Velodrome")
    f = open(table, 'w')
    f.write(text)
    f.close()

print "DONE VELODROME"

for table in tables:
    f = open(table, 'r')
    text = f.read()
    f.close()
    text = text.replace("Te Rauparaha, Porirua", "Te Rauparaha Arena, Porirua")
    f = open(table, 'w')
    f.write(text)
    f.close()

print "DONE PORIRUA"

for table in tables:
    f = open(table, 'r')
    text = f.read()
    f.close()
    text = text.replace("Westpac Centre, Christchurch", "Westpac Arena, Christchurch")
    f = open(table, 'w')
    f.write(text)
    f.close()

print "DONE WESTPAC"

for table in tables:
    f = open(table, 'r')
    text = f.read()
    f.close()
    text = text.replace("Westpac Arena, Christchurch", "CBS Canterbury Arena, Christchurch")
    f = open(table, 'w')
    f.write(text)
    f.close()

print "DONE WESTPAC2"

for table in tables:
    f = open(table, 'r')
    text = f.read()
    f.close()
    text = text.replace("\xe2\x80\x93", "-")
    f = open(table, 'w')
    f.write(text)
    f.close()

print "DONE HYPHEN"

for table in tables:
    f = open(table, 'r')
    text = f.read()
    f.close()
    text = text.replace(",Adelaide Entertainment Centre", ",\"Adelaide Entertainment Centre, Adelaide\"")
    f = open(table, 'w')
    f.write(text)
    f.close()

print "DONE ADEL"

for table in tables:
    f = open(table, 'r')
    text = f.read()
    f.close()
    text = text.replace("State Netball Hockey Centre, Melbourne", "State Netball and Hockey Centre, Melbourne")
    f = open(table, 'w')
    f.write(text)
    f.close()

print "DONE NETBALLAND"

for table in tables:
    f = open(table, 'r')
    text = f.read()
    f.close()
    text = text.replace("Claudelands Arena, Waikato", "Claudelands Arena, Hamilton")
    f = open(table, 'w')
    f.write(text)
    f.close()

print "DONE CLAUDE"
