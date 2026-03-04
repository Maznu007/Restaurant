import React from 'react';
import { data } from '../restApi.json';

const WhoAreWe = () => {
  return (
    <>
      <section className='who_are_we' id='who_are_we'>
        <div className="container">
          <div className="text_banner">
            {data[0].who_we_are.map(element => (
              <div className="card" key={element.id}>
                <h1>{element.number}</h1>
                <p>{element.title}</p>
              </div>
            ))}
          </div>
          <div className="image_banner">
            <img src="whoweare.png" alt="Restaurant interior" />
          </div>
        </div>
      </section>
    </>
  );
};

export default WhoAreWe;