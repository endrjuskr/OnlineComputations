from django.shortcuts import render
from dajaxice.decorators import dajaxice_register


@dajaxice_register
def get_introduction_view(request):
    return render(request, "centralities/views/introductionView.html")


@dajaxice_register
def get_default_options_view(request):
    return render(request, "centralities/views/defaultOptionsView.html")


@dajaxice_register
def get_status_view(request):
    return render(request, "centralities/views/statusView.html")


@dajaxice_register
def get_centralities_view(request):
    return render(request, "centralities/views/centralitiesView.html")


@dajaxice_register
def get_graph_view(request):
    return render(request, "centralities/views/graphView.html")


@dajaxice_register
def get_predefined_graph_view(request):
    return render(request, "centralities/views/predefinedGraphView.html")


@dajaxice_register
def get_random_graph_view(request):
    return render(request, "centralities/views/randomGraphView.html")