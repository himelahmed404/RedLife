import DonationRequestsCards from '@/components/DashBoard/DonationRequestsCards';
import React from 'react';

const VolunteerMyDonationRequest = () => {
    return (
        <div>
            <DonationRequestsCards personalOnly={true}></DonationRequestsCards>
        </div>
    );
};

export default VolunteerMyDonationRequest;