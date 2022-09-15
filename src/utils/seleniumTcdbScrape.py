
import requests
from bs4 import BeautifulSoup
import time
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import ElementClickInterceptedException

driver = webdriver.Chrome('./chromedriver.exe')

Teams= ["Arizona Cardinals", "Atlanta Falcons", "Baltimore Ravens", "Buffalo Bills", "Miami Dolphins","New York Giants","Dallas Cowboys","New England Patriots","Philadelphia Eagles","New York Jets","Washington Commanders","Chicago Bears","Cincinnati Bengals","Detroit Lions","Cleveland Browns","Green Bay Packers","Pittsburgh Steelers","Minnesota Vikings","Houston Texans","Indianapolis Colts","Carolina Panthers","Jacksonville Jaguars","New Orleans Saints","Tennessee Titans","Tampa Bay Buccaneers","Denver Broncos","Kansas City Chiefs","Los Angeles Rams","Las Vegas Raiders","San Francisco 49ers","Los Angeles Chargers","Seattle Seahawks"]
cardNames = []

program_starts = time.time()


for team in Teams:
    driver.get('https://www.tcdb.com/Teams.cfm/sp/Football?MODE=SELECT')

    try:
        # Get to Team Page
        teamPageLink = driver.find_element("link text", team)
        teamPageLink.click()
    except ElementClickInterceptedException:
        time.sleep(20)
        teamPageLink = driver.find_element("link text", team)
        teamPageLink.click()
    except NoSuchElementException:
        time.sleep(20)
        teamPageLink = driver.find_element("link text", team)
        teamPageLink.click()

    #'Cards' Tab on Team Page
    cardLink = driver.find_element("link text", 'Cards')
    cardLink.click()

    #Only get cards from 2017-Present
    year = 2017
    yearPage = driver.find_element("link text", str(year))
    yearPage.click()
    
    #Loop to get all cards
    nextPageFlag = True
    while(nextPageFlag):
        cardNameCells = driver.find_elements(By.CLASS_NAME, "vertical")
        #Get All Card Names on Current Page
        for cardCell in cardNameCells:
            cardName = cardCell.find_element(By.TAG_NAME, 'a')
            cardNames.append(cardName.text)
            print(cardName.text)
        #Go to next page until last
        try:
            nextPage = driver.find_element("link text", '›')
            nextPage.click()
        except NoSuchElementException:
            year += 1
            try:
                nextYear = driver.find_element("link text", str(year))
                nextYear.click()
            except NoSuchElementException:
                nextPageFlag = False
                break
        except ElementClickInterceptedException:
            time.sleep(15)
            nextPage = driver.find_element("link text", '›')
            nextPage.click()

    now = time.time()
    print("{} took {} seconds to parse".format(team, now-program_starts))
print(cardNames)
 
