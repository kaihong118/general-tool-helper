import express, { Request, Response } from 'express';
import axios from 'axios';

export default class AxiosHelper {
  public static init() {
    const app = express();
    app.listen(3000);

    app.get('/api/data', async (req: Request, res: Response) => {
      try {
        const data = await fetchData();
        res.send(data);
      } catch (error) {
        res.status(500).send('Error fetching data');
      }
    });

    const fetchData = async (): Promise<string> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('Data fetched');
        }, 1000);
      });
    };

    const makeRequest = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/data');
        console.log(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Simulate 10 concurrent requests
    for (let i = 0; i < 10; i++) {
      makeRequest();
    }
  }
}
