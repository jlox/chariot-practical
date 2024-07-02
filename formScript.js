let connectScript = document.createElement("script");
connectScript.src = "https://cdn.givechariot.com/chariot-connect.umd.js";
document.head.appendChild(connectScript);

function getDonationAmount() {
  const activeElement = document.querySelector(
    ".donation-level-container .donation-level-input-container label .donation-level-amount-container"
    );

  let amount = undefined;

  if (activeElement) {
    amount = parseAmount(activeElement.textContent);
  } else {
    const customAmount = parseFloat(
      parseAmount(
        document.querySelector(
          '.donation-level-container.other-amount .donation-level-user-entered input[type="text"]'
        )?.value || ""
      )
    );

    if (!customAmount) {
      return undefined;
    }

    amount = customAmount;
  }

  const feesCheck = document.getElementById("cover_fees_radio")?.checked;
  if (feesCheck) {
    const feeElement = document.getElementById("cover_fees_activeamt");
    const feeAmount = parseAmount(feeElement.textContent);
    amount += feeAmount;
  }

  return Math.ceil(amount) * 100;
}

function parseAmount(content) {
  const amountText = content.replace("$", "").replace(",", "");
  return parseFloat(amountText);
}

function waitForElement(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

waitForElement(
  "#payment_cc_container"
).then((elm) => {
  var chariot = document.createElement("chariot-connect");
  chariot.setAttribute("cid", "test_42938b6e1af35ff9ba360c0e3239e8afc688a1e5c55fa969d353b58d6ba238ad");
  chariot.setAttribute("theme", 'GradientTheme')
  chariot.setAttribute("id", "chariot")

  const externalPaymentSpan = document.createElement("span");
  externalPaymentSpan.appendChild(chariot);
  const paymentDiv = document.getElementById('payment_cc_container');
  const paymentNode = document.getElementById('payment_cc_container').parentNode;
  paymentNode.insertBefore(externalPaymentSpan, paymentDiv);

  // Wait on the Chariot Connect to be initialized before defining the
  // onDonationRequest
  chariot.addEventListener("CHARIOT_INIT", () => {
    chariot.onDonationRequest(async () => {
      const form = $("form").serializeArray();
      const formMap = form.reduce((accumulator, item) => {
        accumulator[item.name] = item.value;
        return accumulator;
      }, {});

      const firstName = formMap["billing_first_namename"];
      const middleName = formMap["billing_middle_namename"]
      const lastName = formMap["billing_last_namename"];
      const email = formMap["donor_email_addressname"];
      const street1 = formMap["billing_addr_street1name"];
      const street2 = formMap["billing_addr_street2name"];
      const city = formMap["billing_addr_cityname"];
      const state = formMap["billing_addr_state"];
      const zip = formMap["billing_addr_zipname"];

      if (
        !firstName ||
        !lastName ||
        !email ||
        !street1 ||
        !city ||
        !state ||
        !zip
      ) {
        alert("Please fill out all required fields");
        return;
      }

      const phone = formMap["mobile_phone_input"] || formMap["donor_phonename"];
      const recognitionName = formMap["tr_recognition_namerec_namename"];
      const anonymousCheck = formMap["tr_recognition_nameanonymousname"] === "on";
      const displayGiftCheck = formMap["tr_show_gift_to_publicname"] === "on";
      const includeJointDonor =
        formMap["add_a_spouse_or_partner_name_radio"] === "true";
        console.log('getDonationAmount(): ', getDonationAmount());
      return {
        amount: getDonationAmount(),
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        frequency: "ONE_TIME",
        address: {
          line1: street1,
          line2: street2,
          city,
          state,
          country: '',
          postalCode: zip
        },
        metadata: {
          street1: street1,
          street2: street2,
          city: city,
          state: state,
          zip: zip,
          recognitionName: recognitionName,
          anonymous: anonymousCheck,
          displayGift: displayGiftCheck,
          jointDonorFirstName: includeJointDonor
            ? formMap["joint_donor_first_namename"]
            : undefined,
          jointDonorLastName: includeJointDonor
            ? formMap["joint_donor_last_namename"]
            : undefined,
        },
      };
    });

    chariot.addEventListener('CHARIOT_SUCCESS', ({ detail }) => {
      const amount = detail.grantIntent.amount;
      const workflowSessionId = detail.workflowSessionId;

      const req = {
        method: 'POST',
        headers: {
          // accept: 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ workflowSessionId, amount })
      };

      fetch("http://localhost:3000/submit", req)
      .then(response => {
        console.log('response:', response)
      })
      .catch(err => console.error(err));
      
      if (detail.grantIntent) {
        window.location.href = "https://www.thankyou.com/";
      }
    });

  });

});