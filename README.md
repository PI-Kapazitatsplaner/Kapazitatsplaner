# [PI-Planning-Kapazitaetsplaner](https://kapazitaetsplaner.atlassian.net/)

# Inhaltsverzeichnis

- [PI-Planning-Kapazitaetsplaner](#pi-planning-kapazitaetsplaner)
- [Inhaltsverzeichnis](#inhaltsverzeichnis)
- [Management Summary](#management-summary)
  - [Hintergrund](#hintergrund)
  - [Ziele und Rahmenbedingungen](#ziele-und-rahmenbedingungen)
  - [Nächste Schritte](#nächste-schritte)
- [Einleitung](#einleitung)
- [Umgesetzte Anforderungen](#umgesetzte-anforderungen)
- [UML Komponentendiagramm](#uml-komponentendiagramm)
- [Datenmodell](#datenmodell)
- [Reflexion](#reflexion)
# Management Summary
## Hintergrund
Im Rahmen des Basislehrjahrs im 4. Semester der Applikationsentwickler-Ausbildung, bekamen wir den Auftrag während einem Semester ein Projekt umzusetzen. Nach einem Meeting mit unseren Berufsbildnern haben wir uns dazu entschieden einen Kapazitätsplaner zu entwickeln. Unser Entscheid fiel auf dieses Projekt, da die Kapazitätsplanung aktuell mit Excel gemacht wird und es dazu noch keine andere Möglichkeit gibt.

## Ziele und Rahmenbedingungen
Unser Ziel ist es, dass die Applikation von den Teams für deren Kapazitätsplanung verwendet werden kann. Dabei soll auf keine Keyfeatures des Excels verzichtet werden sollen.

Während einem Semester sollten folgende Features umgesetzt werden:
- Kalennder zum Eintragen der Abwesenheiten
- Tabelle zum Anzeigen der Velocity und eintragen der umgesetzten Storypoints
- Einstellungen zum sich einem Team zuzuweisen, seine Arbeitszeiten einzutragen und das Erscheinungsbild der Applikation zu verändern.
- Sprintverwaltung um die Sprints und Planungstage eines PIs zu definieren
- Feiertageverwaltung um die Feiertage eines Jahres einzutragen
- Login, welches kompatibel mit dem Loginsystem der Suva ist

Zusätliche features währen:
- Einsehen in fremde Kalender
- Einsehen in fremde Teamkalender

## Nächste Schritte
Die weiteren Schritte währen: Dass ganze Projekt in der Suva zu deployen und die Applikation im grösseren Rahmen zu testen. Dazu fallen (hoffentlich möglichst wenige) Bugs an, welche gefixt werden müssen. Dies wird aber in der Rösslimatt gemacht und nicht mehr im Basislehrjahr in Adligenswil.

# Einleitung
Im 4. Semester der Informatikerausbildung haben wir im Rahmen des Basislehrjahres ein Projekt umgesetzt. Nach einem Meeting mit den Praxisbildnern haben wir uns für einen Kapazitätsplaner im Web entschieden. Wir haben uns dafür entschiedne, weil die Kapazitätsplanung momentan im Excel gemacht wird und es bis dato noch keine Lösung im Web dafür gibt.

Das Ziel war es die bestehenden Funktionen des Excels ins Web zu bringen. Dabei sollte auf keine Features des Excels verzichtet werden sollen.

Für die Realisierung des Kapazitätsplaner haben wir uns ein Scrumboard aufgesetzt, welches wir zu Beginn des Semesters mit den ersten Features befüllt haben. Zudem haben wir auch die Sprints geplant und Einladungen für die jeweiligen Reviews verschickt.

# Umgesetzte Anforderungen
Wir konnten während dem Semester alle grundlegenden Anforderungen umsetzen. Diese währen:
- Kalennder zum Eintragen der Abwesenheiten
- Tabelle zum Anzeigen der Velocity und eintragen der umgesetzten Storypoints
- Einstellungen zum sich einem Team zuzuweisen, seine Arbeitszeiten einzutragen und das Erscheinungsbild der Applikation zu verändern.
- Sprintverwaltung um die Sprints und Planungstage eines PIs zu definieren
- Feiertageverwaltung um die Feiertage eines Jahres einzutragen
- Login, welches kompatibel mit dem Loginsystem der Suva ist

Die zusätzlichen Anforderungen wurden nicht umgesetzt, da wir es nicht für nötig gehalten haben diese zu realisieren. Diese Entschiedung wurde mit dem Praxibildnern gefällt.

# UML Komponentendiagramm
![](docImgs/komponenten-diagramm.png)
# Datenmodell
![](docImgs/prisma-erd.svg)
Erstellt mit <a href="https://prisma-erd.simonknott.de/">Prisma ERD generator</a>
# Reflexion
Wir sind zufrieden mit unserer Arbeit im letzten Semester. Wir sind besonders stolz auf unsere zusammenarbeit. Wir haben immer zusammen die besten entscheidungen getroffen und wir haben unsere arbeit gut aufgeteilt. Gut funktioniert hat auch die Absprache mit dem Homeoffice. Während Rouven lieber im Homeoffice gearbeitet hat, war Gian öfters vor Ort um möglichst effizient zu sein. Wenn Rouven trotzdem vor Ort war, erledigten wir meistens grössere arbeiten im Pair programming, welches auch hervorragend geklappt hat. Im Pair programming war besonders spannend zu sehen, wie die andere Person ein problem angeht. Trotz all dem gibt es auch einige Dinge, welche wir hätten verbessern können. Das wäre die Auswahl vom Stack. Dank unsererm Stack konnten schon sehr früh Ergebnisse erzielt werden, welche sich sehen lassen konnten. Gegen Ende des Projektes wurde es aber zunehmend schwieriger sich im Programmcode zurechtzufinden weil mit der Menge an Code das Projekt etwas unübersichtlich geworden ist.