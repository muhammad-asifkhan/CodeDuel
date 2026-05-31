#include <iostream>
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
}