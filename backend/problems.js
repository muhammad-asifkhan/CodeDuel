const problems = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      description: `Given an array of integers **nums** and an integer **target**, return the indices of the two numbers that add up to target.
  
  You may assume that each input has exactly one solution, and you may not use the same element twice.
  
  Return the answer as a list sorted in ascending order.`,
      examples: [
        {
          input: "nums = [2, 7, 11, 15], target = 9",
          output: "[0, 1]",
          explanation: "Because nums[0] + nums[1] == 9"
        },
        {
          input: "nums = [3, 2, 4], target = 6",
          output: "[1, 2]",
          explanation: "Because nums[1] + nums[2] == 6"
        }
      ],
      testCases: [
        { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
        { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
        { input: { nums: [1, 5, 3, 7], target: 8 }, expected: [0, 3] },
        { input: { nums: [0, 4, 3, 0], target: 0 }, expected: [0, 3] },
        { input: { nums: [-1, -2, -3, -4, -5], target: -8 }, expected: [2, 4] }
      ],
      starterCode: {
        python: `def two_sum(nums, target):
    # Write your solution here
    pass

import json, sys
data = json.loads(sys.argv[1])
result = two_sum(data["nums"], data["target"])
print(json.dumps(result))`,
        javascript: `function twoSum(nums, target) {
  // Write your solution here
}

// Read input
const data = JSON.parse(process.argv[2]);
const result = twoSum(data.nums, data.target);
console.log(JSON.stringify(result));`,
        cpp: `#include <iostream>
#include <vector>
#include "json.hpp"

using json = nlohmann::json;
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};

int main(int argc, char* argv[]) {
    if (argc < 2) return 1;
    json data = json::parse(argv[1]);
    
    vector<int> nums = data["nums"];
    int target = data["target"];
    
    Solution sol;
    auto result = sol.twoSum(nums, target);
    cout << json(result).dump() << endl;
    return 0;
}`
      }
    },
    {
      id: 2,
      title: "Palindrome Check",
      difficulty: "Easy",
      description: `Given a string **s**, determine if it is a palindrome.
  
  A palindrome is a string that reads the same forward and backward.
  
  Consider only alphanumeric characters and ignore cases.
  
  Return **true** or **false**.`,
      examples: [
        {
          input: 's = "racecar"',
          output: "true",
          explanation: "racecar reversed is racecar"
        },
        {
          input: 's = "hello"',
          output: "false",
          explanation: "hello reversed is olleh"
        }
      ],
      testCases: [
        { input: { s: "racecar" }, expected: true },
        { input: { s: "hello" }, expected: false },
        { input: { s: "A man a plan a canal Panama" }, expected: true },
        { input: { s: "abc" }, expected: false },
        { input: { s: "a" }, expected: true }
      ],
      starterCode: {
        python: `def is_palindrome(s):
    # Write your solution here
    pass

import json, sys
data = json.loads(sys.argv[1])
result = is_palindrome(data["s"])
print(json.dumps(result))`,
        javascript: `function isPalindrome(s) {
  // Write your solution here
}

// Read input
const data = JSON.parse(process.argv[2]);
const result = isPalindrome(data.s);
console.log(JSON.stringify(result));`,
        cpp: `#include <iostream>
#include <string>
#include "json.hpp"

using json = nlohmann::json;
using namespace std;

class Solution {
public:
    bool isPalindrome(string s) {
        // Write your solution here
        return false;
    }
};

int main(int argc, char* argv[]) {
    if (argc < 2) return 1;
    json data = json::parse(argv[1]);
    
    string s = data["s"];
    
    Solution sol;
    auto result = sol.isPalindrome(s);
    cout << json(result).dump() << endl;
    return 0;
}`
      }
    },
    {
      id: 3,
      title: "FizzBuzz Sum",
      difficulty: "Easy",
      description: `Given a number **n**, find the sum of all numbers from 1 to n that are divisible by 3 or 5.
  
  Return the total sum as an integer.`,
      examples: [
        {
          input: "n = 10",
          output: "33",
          explanation: "3+5+6+9+10 = 33"
        },
        {
          input: "n = 15",
          output: "60",
          explanation: "3+5+6+9+10+12+15 = 60"
        }
      ],
      testCases: [
        { input: { n: 10 }, expected: 33 },
        { input: { n: 15 }, expected: 60 },
        { input: { n: 1 }, expected: 0 },
        { input: { n: 100 }, expected: 2418 },
        { input: { n: 3 }, expected: 3 }
      ],
      starterCode: {
        python: `def fizzbuzz_sum(n):
    # Write your solution here
    pass

import json, sys
data = json.loads(sys.argv[1])
result = fizzbuzz_sum(data["n"])
print(json.dumps(result))`,
        javascript: `function fizzbuzzSum(n) {
  // Write your solution here
}

// Read input
const data = JSON.parse(process.argv[2]);
const result = fizzbuzzSum(data.n);
console.log(JSON.stringify(result));`,
        cpp: `#include <iostream>
#include "json.hpp"

using json = nlohmann::json;
using namespace std;

class Solution {
public:
    int fizzBuzzSum(int n) {
        // Write your solution here
        return 0;
    }
};

int main(int argc, char* argv[]) {
    if (argc < 2) return 1;
    json data = json::parse(argv[1]);
    
    int n = data["n"];
    
    Solution sol;
    auto result = sol.fizzBuzzSum(n);
    cout << json(result).dump() << endl;
    return 0;
}`
      }
    },
    {
      id: 4,
      title: "Reverse Words",
      difficulty: "Medium",
      description: `Given a string **s**, reverse the order of the words.
  
  A word is defined as a sequence of non-space characters. The words in s are separated by at least one space.
  
  Return the reversed string with single spaces between words.`,
      examples: [
        {
          input: 's = "the sky is blue"',
          output: '"blue is sky the"',
          explanation: "Words reversed in order"
        },
        {
          input: 's = "hello world"',
          output: '"world hello"',
          explanation: "Two words swapped"
        }
      ],
      testCases: [
        { input: { s: "the sky is blue" }, expected: "blue is sky the" },
        { input: { s: "hello world" }, expected: "world hello" },
        { input: { s: "a" }, expected: "a" },
        { input: { s: "coding is fun" }, expected: "fun is coding" },
        { input: { s: "I love Pakistan" }, expected: "Pakistan love I" }
      ],
      starterCode: {
        python: `def reverse_words(s):
    # Write your solution here
    pass

import json, sys
data = json.loads(sys.argv[1])
result = reverse_words(data["s"])
print(json.dumps(result))`,
        javascript: `function reverseWords(s) {
  // Write your solution here
}

// Read input
const data = JSON.parse(process.argv[2]);
const result = reverseWords(data.s);
console.log(JSON.stringify(result));`,
        cpp: `#include <iostream>
#include <string>
#include "json.hpp"

using json = nlohmann::json;
using namespace std;

class Solution {
public:
    string reverseWords(string s) {
        // Write your solution here
        return "";
    }
};

int main(int argc, char* argv[]) {
    if (argc < 2) return 1;
    json data = json::parse(argv[1]);
    
    string s = data["s"];
    
    Solution sol;
    auto result = sol.reverseWords(s);
    cout << json(result).dump() << endl;
    return 0;
}`
      }
    },
    {
      id: 5,
      title: "Max Profit",
      difficulty: "Medium",
      description: `You are given an array **prices** where prices[i] is the price of a stock on the ith day.
  
  You want to maximize your profit by choosing a single day to buy and a single day to sell.
  
  Return the maximum profit you can achieve. If no profit is possible, return 0.`,
      examples: [
        {
          input: "prices = [7, 1, 5, 3, 6, 4]",
          output: "5",
          explanation: "Buy on day 2 (price=1), sell on day 5 (price=6), profit=5"
        },
        {
          input: "prices = [7, 6, 4, 3, 1]",
          output: "0",
          explanation: "No profit possible, prices only decrease"
        }
      ],
      testCases: [
        { input: { prices: [7, 1, 5, 3, 6, 4] }, expected: 5 },
        { input: { prices: [7, 6, 4, 3, 1] }, expected: 0 },
        { input: { prices: [2, 4, 1] }, expected: 2 },
        { input: { prices: [1, 2, 3, 4, 5] }, expected: 4 },
        { input: { prices: [3, 3, 3] }, expected: 0 }
      ],
      starterCode: {
        python: `def max_profit(prices):
    # Write your solution here
    pass

import json, sys
data = json.loads(sys.argv[1])
result = max_profit(data["prices"])
print(json.dumps(result))`,
        javascript: `function maxProfit(prices) {
  // Write your solution here
}

// Read input
const data = JSON.parse(process.argv[2]);
const result = maxProfit(data.prices);
console.log(JSON.stringify(result));`,
        cpp: `#include <iostream>
#include <vector>
#include "json.hpp"

using json = nlohmann::json;
using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        // Write your solution here
        return 0;
    }
};

int main(int argc, char* argv[]) {
    if (argc < 2) return 1;
    json data = json::parse(argv[1]);
    
    vector<int> prices = data["prices"];
    
    Solution sol;
    auto result = sol.maxProfit(prices);
    cout << json(result).dump() << endl;
    return 0;
}`
      }
    }
  ];
  
  export default problems;