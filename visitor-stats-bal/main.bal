import ballerina/io;
import ballerinax/googleapis.sheets as sheets;
import ballerina/http;
import ballerina/time;

configurable string refreshToken = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string spreadsheetId = ?;
configurable string sheetName = ?;
configurable string visitStatAPIUrl = ?;
configurable string visitStatAPITokenURL = ?;
configurable string visitStatAPIConsumerKey = ?;
configurable string visitStatAPIConsumerSecret = ?;

// Configuring Google Sheets API
sheets:ConnectionConfig spreadsheetConfig = {
    auth: {
        clientId: clientId,
        clientSecret: clientSecret,
        refreshUrl: sheets:REFRESH_URL,
        refreshToken: refreshToken
    }
};

// A record to store PR/issue related data
public type Details record {
    string date;
    string inTime;
    string outTime;
    string houseNumber;
    string visitorName;
    string visitorNic;
    string vehicleNumber;
    string visitorPhone;
    string comment;
};

type VisitSvcResponse record {|
    string comment;
    string houseNo;
    string inTime;
    boolean isApproved;
    string outTime;
    string visitDate;
    string visitorName;
    int visitId;
    string visitorNIC;
    string vehicleNumber;
    string visitorPhoneNo;
|};

sheets:Client spreadsheetClient = check new (spreadsheetConfig);

public function insertVisit(VisitSvcResponse visit) {
    error? append = spreadsheetClient->appendRowToSheet(spreadsheetId, sheetName,
    [visit.visitDate, visit.inTime, visit.outTime, visit.houseNo, visit.visitorName, visit.visitorNIC, visit.vehicleNumber, visit.visitorPhoneNo, visit.comment]);
}

public function main() {
    // Clearing the sheet
    error? clearAllBySheetName = spreadsheetClient->clearAllBySheetName(spreadsheetId, sheetName);
    error? append = spreadsheetClient->appendRowToSheet(spreadsheetId, sheetName,
    ["Date", "In Time", "Out Time", "House", "Visitor Name", "Visitor NIC", "Vehicle Number", "Visitor Phone", "Comment"]);

    http:Client|error visitClient = new (visitStatAPIUrl,
        auth = {
            tokenUrl: visitStatAPITokenURL,
            clientId: visitStatAPIConsumerKey,
            clientSecret: visitStatAPIConsumerSecret,
            scopes: "urn:choreoplayground:yasithavisitapivisit420:resident"
        }
    );
    if visitClient is error {
        io:println("Error while initializing the client.");
        return;
    }

    VisitSvcResponse[]|error visitResponse = visitClient->/actualVisits;
    if visitResponse is error {
        io:println("Error while getting the response.", visitResponse);
        return;
    }
    foreach VisitSvcResponse visit in visitResponse {
        time:Utc|error visitDate = time:utcFromString(visit.visitDate);
        if visitDate is error {
            io:println("Date is not in the expected format", visitResponse);
            continue;
        } else {
            // time:Utc currentTime = time:utcNow();
            // time:Utc startTime = utcSubtractSeconds(currentTime, 60 * 60);
            // if (visitDate < startTime) {
            //     continue;
            // }
            //commenting as date returned by the API is very old
        }

        error? insertDetailResponse = insertVisit(visit);
        if (insertDetailResponse is error) {
            io:println("Error while inserting the data.", insertDetailResponse);
            return;
        }
        io:println("Published a visit ", visit.visitId);
    }

    io:println("Successfully inserted the data.");
}

function utcSubtractSeconds(time:Utc utc, int seconds) returns time:Utc {
    [int, decimal] [secondsFromEpoch, lastSecondFraction] = utc;
    secondsFromEpoch = secondsFromEpoch - seconds;
    return [secondsFromEpoch, lastSecondFraction];
}
