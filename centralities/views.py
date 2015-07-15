from django.shortcuts import render
import netconv
import simplejson

def home(request):
    import os
    module_dir = os.path.dirname(__file__)  # get current directory
    file_path1 = os.path.join(module_dir, 'static/test_data/dolphins.net')
    file_path2 = os.path.join(module_dir, 'static/test_data/karate.net')
    file_path3 = os.path.join(module_dir, 'static/test_data/lesmis.net')

    dolphins = netconv.Network()
    netconv.importPajek(dolphins, file_path1)
    karate = netconv.Network()
    netconv.importPajek(karate, file_path2)
    lesmis = netconv.Network()
    netconv.importPajek(lesmis, file_path3)

    print ";".join(",".join(x) for x in dolphins.toList())


    return render(request, "centralities/index.html", {
        'dolphins': ";".join(",".join(x) for x in dolphins.toList()),
        'karate': ";".join(",".join(x) for x in karate.toList()),
        'lesmis': ";".join(",".join(x) for x in lesmis.toList())
    })