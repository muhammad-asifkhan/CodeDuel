const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const code = `#include <iostream>
#include <vector>
#include "json.hpp"
using json = nlohmann::json;
using namespace std;
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        return {0, 1};
    }
};
int main(int argc, char* argv[]) {
    if (argc < 2) return 1;
    try {
        json data = json::parse(argv[1]);
        vector<int> nums = data["nums"];
        int target = data["target"];
        Solution sol;
        auto result = sol.twoSum(nums, target);
        cout << json(result).dump() << endl;
    } catch (const std::exception& e) {
        cerr << "JSON Exception: " << e.what() << endl;
        return 1;
    }
    return 0;
}`;

fs.writeFileSync('test_cmd.cpp', code);
const compileProc = spawn('g++', ['test_cmd.cpp', '-I', process.cwd(), '-o', 'test_cmd.exe']);
compileProc.stderr.on('data', d => console.error('Compile Err:', d.toString()));
compileProc.on('close', code => {
    if (code !== 0) return console.log('Compile failed with exit code', code);
    
    // Test the input JSON escaping exactly like the server
    const input = { nums: [2, 7, 11, 15], target: 9 };
    const inputStr = JSON.stringify(input);
    console.log("Input string to spawn:", inputStr);
    
    const proc = spawn('.\\test_cmd.exe', [inputStr]);
    proc.stdout.on('data', d => console.log('STDOUT:', d.toString()));
    proc.stderr.on('data', d => console.log('STDERR:', d.toString()));
    proc.on('close', c => console.log('Run Done', c));
});
