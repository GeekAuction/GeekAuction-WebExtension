var gaHref = 'https://vk.com/gs_auction';
var dbUrl  = 'https://raw.githubusercontent.com/GeekAuction/Database/master/GeekAuction.json';

function isNullOrEmpty(v) {
    return typeof v === 'undefined' || v === null || !v;
}

function safe_tags(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') ;
}

function formatNames(person) {
    var value = '';
    for (var i = 0; i < person.Names.length - 1; i++) {
        value += '<span>' + safe_tags(person.Names[i]) + '</span>, ';
    }
    if (person.Names.length > 0) {
        value += '<span>' + safe_tags(person.Names[i]) + '</span>';
    }
    return value;
}

function formatIDs(person) {
    var value = '';
    for (var i = 0; i < person.IDs.length - 1; i++) {
        value += '<a href="https://vk.com/id' + person.IDs[i] + '">' + person.IDs[i] + '</a>, ';
    }
    if (person.IDs.length > 0) {
        value += '<a href="https://vk.com/id' + person.IDs[i] + '">' + person.IDs[i] + '</a>';
    }
    return value;
}

function formatNicknames(person) {
    var value = '';
    for (var i = 0; i < person.Nicknames.length - 1; i++) {
        value += '<a href="https://vk.com/' + safe_tags(person.Nicknames[i]) + '">' + safe_tags(person.Nicknames[i]) + '</a>, ';
    }
    if (person.Nicknames.length > 0) {
        value += '<a href="https://vk.com/' + safe_tags(person.Nicknames[i]) + '">' + safe_tags(person.Nicknames[i]) + '</a>';
    }
    return value;
}

function formatReputation(person) {
    var value = '';

    value += '<span><b>' + (person.Pluses - person.Minuses) + '</b> (' + person.Pluses + ' плюсов, ' + person.Minuses + ' минусов)</span>';

    if (person.Approved) {
        value += ', <span><b>Личность подтверждена</b></span>';
    }
    if (person.Blacklist) {
        value += ', <span style="color: #b85300;"><b>В черном списке</b></span>';
    }
    if (person.Swindler) {
        value += ', <span style="color: #e40000;"><b>Мошенник</b></span>';
    }
    return value;
}

function createBlock(person) {
    var newBlock = window.document.createElement('div');
    newBlock.id = 'ga_block';
    newBlock.className = 'page_block';
    
    newBlock.innerHTML =
    '<div id="ga_info_wrap" class="page_info_wrap">' +
        '<div style="text-align: center"><b><a href="' + gaHref + '">Гик-Аукцион</a></b></div>' +
        ((person.Approved) ? (
        '<p></p><div style="text-align: center"><b>Личность данного товарища подтверждена</b></div>'
        ) : '') +
        ((person.Blacklist) ? (
        '<p></p><div style="text-align: center; color: #b85300;"><b>Данный товарищ находится в черном списке сообщества</b></div>'
        ) : '') +
        ((person.Swindler) ? (
        '<p></p><div style="text-align: center; color: #e40000;"><b>Внимание! Данный товарищ является мошенником!</b></div>'
        ) : '') +
        '<div class="profile_info profile_info_short" id="ga_short">' +
            ((person.Names.length != 0) ? (
            '<div class="clear_fix profile_info_row ">' +
                '<div class="label fl_l">Личность:</div>' +
                '<div class="labeled">' + formatNames(person) + '</div>' +
            '</div>') :
            ''
            ) +
            ((person.IDs.length != 0) ? (
            '<div class="clear_fix profile_info_row ">' +
                '<div class="label fl_l">ВК ID:</div>' +
                '<div class="labeled">' + formatIDs(person) + '</div>' +
            '</div>') :
            ''
            ) +
            ((person.Nicknames.length != 0) ? (
            '<div class="clear_fix profile_info_row ">' +
                '<div class="label fl_l">ВК Ник:</div>' +
                '<div class="labeled">' + formatNicknames(person) + '</div>' +
            '</div>') :
            ''
            ) +
            '<div class="clear_fix profile_info_row ">' +
                '<div class="label fl_l">Репутация:</div>' +
                '<div class="labeled">' + formatReputation(person) + '</div>' +
            '</div>' +
            ((!isNullOrEmpty(person.Comment)) ? (
            '<div class="clear_fix profile_info_row ">' +
                '<div class="label fl_l">Доп. информация:</div>' +
                '<div class="labeled">' + safe_tags(person.Comment) + '</div>' +
            '</div>') :
            ''
            ) +
            ((person.Approved && !isNullOrEmpty(person.ApprovedComment)) ? (
            '<div class="clear_fix profile_info_row ">' +
                '<div class="label fl_l"><span><b>К статусу</b></span>:</div>' +
                '<div class="labeled">' + safe_tags(person.ApprovedComment) + '</div>' +
            '</div>') :
            ''
            ) +
            ((person.Blacklist && !isNullOrEmpty(person.BlacklistComment)) ? (
            '<div class="clear_fix profile_info_row ">' +
                '<div class="label fl_l"><span style="color: #b85300;"><b>К статусу</b></span>:</div>' +
                '<div class="labeled">' + safe_tags(person.BlacklistComment) + '</div>' +
            '</div>') :
            ''
            ) +
            ((person.Swindler && !isNullOrEmpty(person.SwindlerComment)) ? (
            '<div class="clear_fix profile_info_row ">' +
                '<div class="label fl_l"><span style="color: #e40000;"><b>К статусу</b></span>:</div>' +
                '<div class="labeled">' + safe_tags(person.SwindlerComment) + '</div>' +
            '</div>') :
            ''
            ) +
        '</div>' +
    '</div>';
    
    return newBlock;
}

function addGAInfo(db, username, userId) {
    // var dbEntry = {};
    // if (db.hasOwnProperty(username)) {
    //     dbEntry = db[username];
    // } else if (db.hasOwnProperty(userId)) {
    //     dbEntry = db[userId];
    // } else {
    //     return;
    // }
    
    var person = null;

    for (var i = 0; i < db.length; i++) {
        if (userId !== '' && db[i].IDs.includes(parseInt(userId))) {
            person = db[i]; break;
        }
        if (db[i].Nicknames.includes(username)) {
            person = db[i]; break;
        }
    }

    if (person == null) {
        return;
    }

    var block = window.document.querySelector('#wide_column > #ga_block');
    if (!isNullOrEmpty(block)) {
        block.remove();
    }
    var firstBlock = window.document.querySelector('#wide_column > .page_block');
    var newBlock = createBlock(person);
    firstBlock.parentNode.insertBefore(newBlock, firstBlock);
}

var gaDatabase         = {};
var gaDatabaseLastLoad = new Date(0);
var gaDatabaseLoading  = false;

function createDB(string) {
    return JSON.parse(string);
}

// should be moved to background script...
function loadDB() {
    if (gaDatabaseLoading) return Promise.resolve(null);
    
    var curDate = Date.now();
    if ((curDate - gaDatabaseLastLoad) < 5 * 60 * 1000) {
        return Promise.resolve(gaDatabase);
    }
    
    gaDatabaseLoading = true;
    
    var req = new XMLHttpRequest({mozSystem: true});
    req.withCredentials = true;
    req.open("GET", dbUrl, true);
    req.setRequestHeader("Pragma", "no-cache");
    req.setRequestHeader("Cache-Control", "no-cache");
    
    return new Promise((resolve, reject) => {
        req.onload = () => {
            //console.log("------------ db loading -----------");
            //console.log(req.responseText);
            //console.log("------------ db loaded ------------");
            gaDatabase = createDB(req.responseText);
            gaDatabaseLastLoad = curDate;
            gaDatabaseLoading = false;
            //console.log("------------ db parsing -----------");
            //console.log(JSON.stringify(db, null, 4));
            //console.log("------------ db parsed ------------");
            resolve(gaDatabase);
        };
        req.send(null);
    });
}



function run() {
    var url = window.location.href;
    var match = url.match(/^http(?:s)?\:\/\/[\w\.\-\_]*vk\.com\/([^\s\/\?\#]+)\/?(?:\#.*)?$/);
    var username = '';


    if (!isNullOrEmpty(match)) {
        username = match[1];
        var editButton = window.document.querySelector('a[href="edit"]');
        if (!isNullOrEmpty(editButton)) {
            return;
        }
        var regex = /\/wall(\d+)/g;
        match = regex.exec(window.document.body.innerHTML);
        var userId = '';
        if (!isNullOrEmpty(match)) {
            userId = match[1];
        }
        loadDB().then(function(db) {
            if (db == null) return; /* loading */
            addGAInfo(db, username, userId);
        });
    }
};

//run();

if (typeof browser !== 'undefined') {
    browser.runtime.onMessage.addListener(
        function (request, sender) {
            run();
        }
    );
    
    browser.runtime.sendMessage({});
} else if (typeof chrome !== 'undefined') {
    chrome.extension.onMessage.addListener(
        function (request, sender) {
            run();
        }
    );
    
    chrome.extension.sendMessage({});
}