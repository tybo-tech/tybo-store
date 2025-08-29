<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
$data = json_decode(file_get_contents("php://input"));
if (isset($data)) {

    $Email = $data->Email;
    $Subject = $data->Subject;
    $Message = $data->Message;
    $Link = $data->Link;
    $UserFullName = $data->UserFullName;
    $Description = $data->Name;
    $Amount = $data->Amount;
    $AmountDue = $data->AmountDue;
    $AmountPaid = $data->AmountPaid;
    $NextBillingDate = $data->NextBillingDate;

    $msg = '  
    
<body style="font-family: Calibri;">
<div class="main">
    <div class="box"
         style="padding: 0;background: #F5F6FA;">
        <div class="header"
             style="background:#009CD7;padding: 2%;">
            <h1 style="text-align: center;color: #ffffff;font-size: 1.5rem; font-weight: 900;">
            Tybo Fashion Accounts
                <span style="display: block;font-size: 1.2rem; font-weight: 400;">Payment Information for ' . $UserFullName . '</span>
            </h1>
        </div>

        <div class="body"
             style="padding: 5%;">
            <p>
                Hi ' . $UserFullName . '<br /><br /><br />
                We hope your are doing well, this letter serves as payment information required in order to continue
                using our platform.
            </p>
            <p>
                <b>Our bank details</b>
            </p>
            <div>
                <p>Please make payments to the following bank details:</p>
                <p>
                    Banking Details <span style="font-weight: 700;">: Capitec Bank</span>
                </p>
                <p>
                    Account Type: <span style="font-weight: 700;">: Savings Account</span>
                </p>
                <p>
                    Account Number: <span style="font-weight: 700;">: 1475170147</span>
                </p>
                <p>
                    Branch Code: <span style="font-weight: 700;">: 470010</span>
                </p>
                <p>
                    Reference: <span style="font-weight: 700;">: [YOUR NAME]</span>
                </p>
                <hr>
            </div>
            <p>
                <b>Amount Payable</b>
            </p>
            <div>
                <p>Please see <b>IMPORTANT</b> information below:</p>
                <p>
                    Description <span style="font-weight: 700;">: ' . $Description . '</span>
                </p>
                <p>
                    Total: <span style="font-weight: 700;">: <b>R' . $Amount . '</b></span>
                </p>
                <p>
                    Amount Paid: <span style="font-weight: 700;">: R' . $AmountPaid . '</span>
                </p>
                <p>
                    Amount Due: <span style="font-weight: 700;">: <b>R' . $AmountDue . '</b></span>
                </p>
                <p>Next Payment Due Date: <b>' . $NextBillingDate . '</b></p>
                <hr>
            </div>          
            <br />
            <br />
            <p>
                Yours faithfully <br> Tybo Fashion team</p>
        </div>
    </div>
</div>
</body>
';

    $to = $Email . ", mrnnmthembu@gmail.com ,ndu.systems@gmail.com";
    $subject =  $Subject;
    $from = 'billing@onlinethalente.co.za';

    $headers  = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

    $headers .= 'From: ' . $from . "\r\n" .
        'Reply-To: ' . $from . "\r\n" .
        'X-Mailer: PHP/' . phpversion();

    if (isset($Email)) {
        if (mail($to, $subject, $msg, $headers)) {
            echo 1;
        } else {
            echo 0;
        }
    } else {
        echo 3;
    }
}
