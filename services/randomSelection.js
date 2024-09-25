function randomSelection (filteredGames) {
    
    let noReleaseGames = filteredGames.filter((game) => game.dataValues.release_date === null);
    
    
    let releaseGames = filteredGames.filter((game) => game.dataValues.release_date !== null).sort((a, b) => new Date(a.dataValues.release_date) - new Date(b.dataValues.release_date));
    
    
    let olderGames;
    if(releaseGames.length > 4) { 
        olderGames = releaseGames.slice(0, -4);
    } else if (releaseGames.length === 1) {
        olderGames = releaseGames.slice(0, releaseGames.length)
    } else {
        olderGames = releaseGames.slice(0, -1);
    }
    
    const eligibleGames = [...noReleaseGames, ...olderGames];

    if(eligibleGames.length === 0) {
        return null;
    }

    const randomId = Math.floor(Math.random() * eligibleGames.length);
    const randomGame = eligibleGames[randomId];
               
    return randomGame;
}

module.exports = randomSelection;