
import requests
from bs4 import BeautifulSoup
import time
from selenium import webdriver
Teams= ["Arizona Cardinals", "Atlanta Falcons", "Baltimore Ravens", "Buffalo Bills", "Miami Dolphins","New York Giants","Dallas Cowboys","New England Patriots","Philadelphia Eagles","New York Jets","Washington Commanders","Chicago Bears","Cincinnati Bengals","Detroit Lions","Cleveland Browns","Green Bay Packers","Pittsburgh Steelers","Minnesota Vikings","Houston Texans","Indianapolis Colts","Carolina Panthers","Jacksonville Jaguars","New Orleans Saints","Tennessee Titans","Tampa Bay Buccaneers","Denver Broncos","Kansas City Chiefs","Los Angeles Rams","Las Vegas Raiders","San Francisco 49ers","Los Angeles Chargers","Seattle Seahawks"]
cardNames = []
# teamPageDiv = soup.find('div', class_='block1')
#teamsPageDivLists = teamPageDiv.find_all('ul')
#teamsPageList = teamsPageDivLists[0] """
program_starts = time.time()
r = requests.get('https://www.tcdb.com/Teams.cfm/sp/Football?MODE=SELECT')
#Teams Page
soup = BeautifulSoup(r.content, 'html.parser')

for team in Teams:
    # Making a GET request
    teamPageLink = soup.find('a', text=team)
    teamPageRequest = requests.get('https://www.tcdb.com' + teamPageLink.get('href'))
    soupTeamPage = BeautifulSoup(teamPageRequest.content, 'html.parser')
    #'Cards' Tab on Team Page
    cardLink = soupTeamPage.find('a', text='Cards')
    if(cardLink):
        cardPageRequest = requests.get('https://www.tcdb.com' + cardLink.get('href'))
        cardsPageSoup = BeautifulSoup(cardPageRequest.content, 'html.parser')

    #Only get cards from 2017-Present
    year = 2017
    yearPage = cardsPageSoup.find('a', text=str(year))
    yearPageRequest = requests.get('https://www.tcdb.com' + yearPage.get('href'))
    cardsPageSoup = BeautifulSoup(yearPageRequest.content, 'html.parser')
    
    #Loop to get all cards
    cardNameCells = cardsPageSoup.find_all('td', class_="vertical")
    nextPageFlag = True
    while(nextPageFlag):
        #Get All Card Names on Current Page
        for cardCell in cardNameCells:
            cardName = cardCell.find('a')
            cardNames.append(cardName.get_text())
        #Go to next page until last
        nextPage = cardsPageSoup.find('a', text='›')
        if nextPage:
            #print('found next page')
            nextPageRequest = requests.get('https://www.tcdb.com' + nextPage.get('href'))
            print('https://www.tcdb.com' + nextPage.get('href'))
            cardsPageSoup = BeautifulSoup(nextPageRequest.content, 'html.parser')
        else:
            time.sleep(1)
            year += 1
            nextYear = cardsPageSoup.find('a', text=str(year))
            if(nextYear):
                print('https://www.tcdb.com' + nextYear.get('href'))
                nextPageRequest = requests.get('https://www.tcdb.com' + nextYear.get('href'))
                cardsPageSoup = BeautifulSoup(nextPageRequest.content, 'html.parser')
            else:
                nextPageFlag = False
                break
        cardNameCells = cardsPageSoup.find_all('td', class_="vertical")
    now = time.time()
    print("{} took {} seconds to parse".format(team, now-program_starts))
print(cardNames)
 
