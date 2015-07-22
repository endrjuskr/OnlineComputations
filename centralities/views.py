from django.shortcuts import render
import netconv
import simplejson

def home(request):
    import os
    module_dir = os.path.dirname(__file__)  # get current directory
    from os import listdir
    from os.path import isfile, join
    mypath = os.path.join(module_dir, 'static/test_data/')
    onlyfiles = [ f for f in listdir(mypath) if isfile(join(mypath,f)) ]


    paths = {}

    for f in onlyfiles:
        net = netconv.Network()
        if f.endswith('.net'):
            netconv.importPajek(net, os.path.join(mypath, f))
        else:
            netconv.importGML(net, os.path.join(mypath, f))
        name = f.split('.')[0]
        paths[name] = ";".join(",".join(x) for x in net.toList())

    t = "$".join("%s*%s" % (k, v) for (k, v) in paths.iteritems())

    return render(request, "centralities/index.html", { 'graphs': t })