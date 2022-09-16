/**
 * Class to control polling
 */
export class Poll {
  private fn: (attempt: number) => Promise<void>;
  private maxAttempts: number; // 0 for infinite
  private sleepTime: number;
  private running: boolean;

  constructor ({ maxAttempts = 5, sleepTime = 5000 }, fn: () => Promise<void>) {
    if (!fn) {
      throw new Error('The poll function is required');
    }

    this.fn = fn;
    this.maxAttempts = maxAttempts;
    this.sleepTime = sleepTime;
    this.running = false;
  }

  /**
   * Starts the poll
   */
  public async start () {
    if (this.running) {
      throw new Error('The poll is already running');
    }

    if (!this.fn) {
      throw new Error('The poll function has to be declared');
    }


    this.running = true;
    let attempt = 0;
    do {
      await this.fn(attempt);

      const isTheLastAttempt = this.maxAttempts === 0 ? false : attempt === this.maxAttempts - 1;
      if (!isTheLastAttempt) {
        await sleep(this.sleepTime);
      }

      attempt++;
    } while ((attempt < this.maxAttempts || this.maxAttempts === 0) && this.running);

    const result = this.running;
    this.running = false;

    return result;
  }

  /**
   * Ends the poll
   */
  public stop () {
    this.running = false;
  }
}

export const sleep = (t: number): Promise<void> => new Promise((resolve) => setTimeout(() => resolve(), t));
