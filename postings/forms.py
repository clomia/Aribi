from django import forms
from postings import models
from archives.models import Constituent, FlavorTag


class PostingCreateFrom(forms.ModelForm):
    class Meta:
        model = models.Posting
        fields = [
            "cocktail_name",
            "content",
            "constituents",
            "flavor_tags",
        ]

    cocktail_name = forms.CharField(
        max_length=30,
        label_suffix="",
        label="",
        widget=forms.TextInput(
            attrs={
                "placeholder": "칵테일 이름",
            }
        ),
    )
    content = forms.CharField(
        max_length=2000,
        widget=forms.Textarea(
            attrs={
                "placeholder": "본문 글 작성",
                "onKeyDown": "resize(this)",
                "onKeyup": "resize(this)",
            }
        ),
        label_suffix="",
        label="",
    )

    def many_to_many_input(self, name, model):
        self.fields[name].widget = forms.widgets.CheckboxSelectMultiple(
            attrs={
                "class": "none",
            },
        )
        self.fields[name].help_text = ""
        self.fields[name].queryset = model.objects.all()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.many_to_many_input("constituents", Constituent)
        self.many_to_many_input("flavor_tags", FlavorTag)
