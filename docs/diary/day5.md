# Day 5
## TODO List
- [ ] Hedge Mechanism
- [ ] Unit Tests
- [ ] Web UI
- [ ] Selling Mechanism
## Questions
### What is the best architecture for Hedging System?
I was adding a class on BaseModel for Hedging Mechanism.
User can add equities to hedge while they have flexibily on implementing the way the hedging works.
The equities however was hoping for a way to send the equities to api and processing inside the model.
Same as the equities for loading transaction dates.

Backtest -> BaseModel -> Hedging System
Backetest -> BaseModel -> Selling Mechanism