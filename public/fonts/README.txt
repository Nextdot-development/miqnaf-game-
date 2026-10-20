Supplied fonts (originals, kept unchanged):

  AcuminVariableConcept.otf   headlines, titles, large numbers
  HelveticaNeue.ttc           questions, answers, body text, buttons
  JT-Distressed.ttf           not used (the clean UI direction does not call for a distressed face)

The app loads the browser-ready copies in web/. Browsers only read the first face of a .ttc
collection, so the Helvetica Neue weights used by the UI (Regular, Medium, Bold, Italic) are
extracted individually. If the source fonts change, regenerate them with:

  pip install fonttools brotli
  python scripts/build-web-fonts.py
