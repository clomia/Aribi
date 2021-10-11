from django import forms
from postings import models
from archives.models import Constituent, FlavorTag


class PostingCreate(forms.ModelForm):
    class Meta:
        model = models.Posting
        fields = [
            "cocktail_name",
            "content",
            "constituents",
            "flavor_tags",
        ]

    def many_to_many_input(self, name, model):
        self.fields[name].widget = forms.widgets.CheckboxSelectMultiple()
        self.fields[name].help_text = ""
        self.fields[name].queryset = model.objects.all()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.many_to_many_input("constituents", Constituent)
        self.many_to_many_input("flavor_tags", FlavorTag)
