/**
 * Random number between range
 * @param  {integer} from
 * @param  {integer} to
 * @return {integer}
 */
Pikanakit.Helpers.randomFromInterval = function(from, to)
{
    return Math.floor(Math.random()*(to-from+1)+from);
};

// EOF