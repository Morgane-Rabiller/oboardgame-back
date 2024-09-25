function randomSelection (filteredGames) {
    
    let noReleaseGames = filteredGames.filter((game) => game.dataValues.release_date === null);
    
    let releaseGames = filteredGames.filter((game) => game.dataValues.release_date !== null).sort((a, b) => new Date(a.dataValues.release_date) - new Date(b.dataValues.release_date));
    

    let olderGames;
    if(releaseGames.length > 4) { 
        olderGames = releaseGames.slice(0, -4);
    } else {
        olderGames = releaseGames.slice(0, -1);
    }

    const eligibleGames = [...noReleaseGames, ...olderGames];

    const randomId = Math.floor(Math.random() * eligibleGames.length);
    const randomGame = eligibleGames[randomId];           
    return randomGame;
}

module.exports = randomSelection;