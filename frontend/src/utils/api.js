

export const lookupPincode = async (pincode) => {
  const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
  const data = await response.json();
  
  if (data[0]?.Status === 'Success') {
    return {
      state: data[0].PostOffice[0].State,
      district: data[0].PostOffice[0].District
    };
  }
  return null;
};
